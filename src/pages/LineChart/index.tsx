import React, { useEffect, useRef, useState } from "react";
import aapl from "./Data/aapl.json";
import * as d3 from "d3";
import { useCreation, useSetState, useSize } from "ahooks";
import moment from "moment";
import { round } from "lodash";

type TAapl = { date: string; close: number };

type TDimensions =
  | {
      width: number;
      height: number;
      margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
      };
    }
  | undefined;

type AxisProps = {
  position: { x: number; y: number } | undefined;
  scale: d3.ScaleTime<number, number, never> | undefined;
};

// 绘制x轴
const XAxis = (props: AxisProps) => {
  const { position, scale } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && scale && position) {
      const axis = d3.axisBottom(scale);
      d3.select(el)
        .call(axis)
        .attr("transform", `translate(${position.x} ${position.y})`);
    }
  };
  return <g ref={refCallback}></g>;
};

type YAxisProps = {
  scale: d3.ScaleLinear<number, number, never> | undefined;
};

// 绘制y轴
const YAxis = (props: YAxisProps) => {
  const { scale } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && scale) {
      const axis = d3.axisLeft(scale);
      d3.select(el).call(axis);
    }
  };
  return <g ref={refCallback}></g>;
};

type LineProps = {
  data: TAapl[];
  serializer: d3.Line<TAapl> | undefined;
};

const Line = (props: LineProps) => {
  const { data, serializer } = props;
  const [lineNode, setLineNode] = useState<SVGPathElement | null>(null);

  const refCallback: React.LegacyRef<SVGPathElement> | undefined = (el) => {
    setLineNode(el);
  };
  useEffect(() => {
    if (lineNode && serializer) {
      d3.select(lineNode)
        .datum(data)
        .attr("d", (d) => serializer(d))
        .attr("fill", "none")
        .attr("stroke", "black");
    }
  }, [lineNode, serializer]);

  return <path ref={refCallback}></path>;
};

type TLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
// 绘制AxisPointer
type AxisPointerProps = {
  innerWidth: number | undefined;
  innerHeight: number | undefined;
  cursorPos:
    | {
        offsetX: number;
        offsetY: number;
      }
    | undefined;
  xScale: d3.ScaleTime<number, number, never> | undefined;
  yScale: d3.ScaleLinear<number, number, never> | undefined;
  serializer: d3.Line<TAapl> | undefined;
  dimensions: TDimensions;
};

const AxisPointer = (props: AxisPointerProps) => {
  const {
    innerWidth,
    innerHeight,
    cursorPos,
    xScale,
    yScale,
    serializer,
    dimensions,
  } = props;
  //
  const pointerInfo = useCreation(() => {
    if (
      innerWidth &&
      innerHeight &&
      cursorPos &&
      xScale &&
      yScale &&
      serializer &&
      dimensions
    ) {
      const curDate = xScale.invert(cursorPos.offsetX);
      // 二分访问器
      const bisect = d3.bisector<TAapl, Date>((d) => new Date(d.date)).left;
      const yOffset = serializer.y()(aapl[bisect(aapl, curDate)], 0, aapl);

      //
      const curMoment = moment(curDate);
      const curClose = yScale.invert(yOffset);
      const xLabel = curMoment.format("YYYY-MM-DD");
      const yLabel = round(curClose);

      const horizontal: TLine = {
        x1: 0,
        y1: yOffset,
        x2: innerWidth,
        y2: yOffset,
      };
      const vertical: TLine = {
        x1: cursorPos.offsetX,
        y1: 0,
        x2: cursorPos.offsetX,
        y2: innerHeight,
      };

      const horizontalLabel = {
        x: -dimensions.margin.left,
        y: yOffset,
        label: yLabel,
        textAnchor: "right",
      };

      const verticalLabel = {
        x: cursorPos.offsetX,
        y: innerHeight + 16,
        label: xLabel,
        textAnchor: "middle",
      };

      return {
        lines: [horizontal, vertical],
        labels: [horizontalLabel, verticalLabel],
      };
    }
  }, [
    innerWidth,
    innerHeight,
    cursorPos,
    xScale,
    yScale,
    serializer,
    dimensions,
  ]);
  return (
    <g>
      <defs>
        <filter id="labelBackground">
          <feFlood
            floodColor={"white"}
            floodOpacity="1"
            result="bgMiddleware"
          ></feFlood>
          <feMerge>
            <feMergeNode in="bgMiddleware" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {pointerInfo?.lines?.map((item, index) => (
        <line key={index} {...item} stroke="#e0e0e0"></line>
      ))}
      {pointerInfo?.labels?.map((item, index) => (
        <text
          filter="url(#labelBackground)"
          x={item.x}
          y={item.y}
          fill="black"
          textAnchor={item.textAnchor}
          style={{ backgroundColor: "black" }}
        >
          {item.label}
        </text>
      ))}
    </g>
  );
};

const LineChart = () => {
  const ref = useRef(null);
  const size = useSize(ref);

  const dimensions: TDimensions = useCreation(() => {
    if (size) {
      const { width } = size;
      return {
        width,
        height: 300,
        margin: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
        },
      };
    }
  }, [size]);

  const innerWidth = useCreation(() => {
    if (dimensions)
      return (
        dimensions.width - dimensions.margin.left - dimensions.margin.right
      );
  }, [dimensions]);

  const innerHeight = useCreation(() => {
    if (dimensions)
      return (
        dimensions.height - dimensions.margin.top - dimensions.margin.bottom
      );
  }, [dimensions]);
  const mainContainerOffset = useCreation(() => {
    if (dimensions) {
      return {
        x: dimensions.margin.left,
        y: dimensions.margin.top,
      };
    }
  }, [dimensions]);

  const xAxisOffset = useCreation(() => {
    if (innerHeight) {
      return {
        x: 0,
        y: innerHeight,
      };
    }
  }, [innerHeight]);

  const xDomain = d3.extent(aapl, (d) => new Date(d.date)) as unknown as [
    Date,
    Date
  ];
  const xRange = useCreation<[number, number] | undefined>(() => {
    if (innerWidth) {
      return [0, innerWidth];
    }
  }, [innerWidth]);
  // scale
  const xScale = useCreation(() => {
    if (xDomain && xRange) {
      return d3.scaleTime().domain(xDomain).range(xRange);
    }
  }, [xDomain, xRange]);

  const yDomain = d3.extent(aapl, (d) => d.close) as unknown as [
    number,
    number
  ];
  const yRange = useCreation<[number, number] | undefined>(() => {
    if (innerHeight) {
      return [innerHeight, 0];
    }
  }, [innerHeight]);

  const yScale = useCreation(() => {
    if (yDomain && yRange) {
      return d3.scaleLinear().domain(yDomain).range(yRange).nice();
    }
  }, [xDomain, xRange]);

  // 画线
  const serializer = useCreation(() => {
    if (xScale && yScale) {
      return d3
        .line<TAapl>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.close));
    }
  }, [xScale, yScale]);

  const [svgContainer, setSvgContainer] = useState<SVGGElement | null>(null);
  const svgCallback: React.LegacyRef<SVGGElement> | undefined = (el) => {
    setSvgContainer(el);
  };

  // 绘制AxisPointer
  // 捕获svg上的事件
  const [svgOffset, setSvgOffset] = useSetState({
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    if (svgContainer) {
      d3.select(svgContainer).on("mousemove", (event: MouseEvent, d) => {
        if (event) {
          const { offsetX, offsetY } = event;
          setSvgOffset({
            offsetX,
            offsetY,
          });
        }
      });
    }
  }, [svgContainer]);

  const cursorPos = useCreation(() => {
    if (svgOffset && dimensions && innerWidth && innerHeight) {
      let offsetX: number = svgOffset.offsetX - dimensions.margin.left;
      let offsetY: number = svgOffset.offsetY - dimensions.margin.top;
      offsetX = offsetX < 0 ? 0 : offsetX;
      offsetX = offsetX > innerWidth ? innerWidth : offsetX;
      // offsetY
      offsetY = offsetY < 0 ? 0 : offsetY;
      offsetY = offsetY > innerHeight ? innerHeight : offsetY;
      return {
        offsetX,
        offsetY,
      };
    }
  }, [svgOffset, dimensions, innerWidth, innerHeight]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <svg
        width={dimensions?.width}
        height={dimensions?.height}
        ref={svgCallback}
      >
        <g
          width={innerWidth}
          height={innerHeight}
          transform={`translate(${mainContainerOffset?.x ?? 0} ${
            mainContainerOffset?.y ?? 0
          })`}
        >
          <XAxis scale={xScale} position={xAxisOffset} />
          <YAxis scale={yScale} />
          <Line data={aapl} serializer={serializer} />
          <AxisPointer
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            cursorPos={cursorPos}
            xScale={xScale}
            yScale={yScale}
            serializer={serializer}
            dimensions={dimensions}
          />
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
