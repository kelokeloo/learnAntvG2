import React, { useEffect, useRef } from "react";
import aapl from "./Data/aapl.json";
import * as d3 from "d3";
import { useCreation, useSize } from "ahooks";

type AxisProps = {
  domain: [Date, Date] | undefined;
  range: [number, number] | undefined;
  position: { x: number; y: number } | undefined;
};

// 绘制x轴
const XAxis = (props: AxisProps) => {
  const { domain, range, position } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && domain && range) {
      const scaleMethod = d3.scaleTime().domain(domain).range(range).nice();
      const axis = d3.axisBottom(scaleMethod);
      d3.select(el)
        .call(axis)
        .attr("transform", `translate(${position?.x} ${position?.y})`);
    }
  };
  return <g ref={refCallback}></g>;
};

type YAxisProps = {
  domain: [number, number] | undefined;
  range: [number, number] | undefined;
};

// 绘制y轴
const YAxis = (props: YAxisProps) => {
  const { domain, range } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && domain && range) {
      const scaleMethod = d3.scaleLinear().domain(domain).range(range).nice();
      const axis = d3.axisLeft(scaleMethod);
      d3.select(el).call(axis);
    }
  };
  return <g ref={refCallback}></g>;
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

  const yDomain = d3.extent(aapl, (d) => d.close) as unknown as [
    number,
    number
  ];
  const yRange = useCreation<[number, number] | undefined>(() => {
    if (innerHeight) {
      return [innerHeight, 0];
    }
  }, [innerHeight]);

  return (
    <div ref={ref}>
      <svg width={dimensions?.width} height={dimensions?.height}>
        <g
          width={innerWidth}
          height={innerHeight}
          transform={`translate(${mainContainerOffset?.x} ${mainContainerOffset?.y})`}
        >
          <XAxis domain={xDomain} range={xRange} position={xAxisOffset} />
          <YAxis domain={yDomain} range={yRange} />
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
