import React, { useEffect, useRef, useState } from "react";
import aapl from "./Data/aapl.json";
import * as d3 from "d3";
import { useCreation, useSetState, useSize } from "ahooks";
import moment from "moment";
import { round } from "lodash";
import XAxis from "./components/XAxis";
import YAxis from "./components/YAxis";
import Line from "./components/Line";
import AxisPointer from "./components/AxisPointer";

type TAapl = { date: string; close: number };

const LineChart = () => {
  const ref = useRef(null);
  const size = useSize(ref);

  const dimensions: BaseTypes.TDimensions = useCreation(() => {
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
            data={aapl}
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            cursorPos={cursorPos}
            xScale={xScale}
            yScale={yScale}
            serializer={serializer}
            dimensions={dimensions}
            xAccessor={(d) => new Date(d.date)}
          />
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
