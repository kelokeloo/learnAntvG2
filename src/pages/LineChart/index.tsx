import React, { useEffect, useRef, useState } from "react";
import aapl from "./Data/aapl.json";
import * as d3 from "d3";
import { useCreation, useSize } from "ahooks";

type TAapl = { date: string; close: number };

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
  xScale: d3.ScaleTime<number, number, never> | undefined;
  yScale: d3.ScaleLinear<number, number, never> | undefined;
  data: TAapl[];
};

const Line = (props: LineProps) => {
  const { xScale, yScale, data } = props;
  const [lineNode, setLineNode] = useState<SVGPathElement | null>(null);

  const serializer = useCreation(() => {
    if (xScale && yScale) {
      return d3
        .line<TAapl>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d.close));
    }
  }, [xScale, yScale]);

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

const LineChart = () => {
  useEffect(() => {
    console.log("aapl", aapl);
  }, []);

  const ref = useRef(null);
  const size = useSize(ref);

  const dimensions = useCreation(() => {
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

  return (
    <div ref={ref}>
      <svg width={dimensions?.width} height={dimensions?.height}>
        <g
          width={innerWidth}
          height={innerHeight}
          transform={`translate(${mainContainerOffset?.x} ${mainContainerOffset?.y})`}
        >
          <XAxis scale={xScale} position={xAxisOffset} />
          <YAxis scale={yScale} />
          <Line data={aapl} xScale={xScale} yScale={yScale} />
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
