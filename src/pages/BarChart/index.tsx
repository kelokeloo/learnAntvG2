import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useCreation, useSize } from "ahooks";
import data from "./data/xz.json";

const BarChart = () => {
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
  const mainContainerOffset = useCreation(() => {
    if (dimensions) {
      return {
        x: dimensions.margin.left,
        y: dimensions.margin.top,
      };
    }
  }, [dimensions]);

  const [svgNode, setSvgNode] = useState<SVGSVGElement | null>(null);

  const svgCallback: React.LegacyRef<SVGSVGElement> = (el) => {
    setSvgNode(el);
  };
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

  const barAttr = {
    barWidth: 2,
    seriesGap: 32,
  };

  const series = useCreation(() => {
    const result: number[] = [];
    if (data && data.length > 0) {
      const length = data[0].length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < data.length; j++) {
          result.push(data[j][i]);
        }
      }
    }
    return result;
  }, [data]);

  const xScale = useCreation(() => {
    if (innerWidth && series && series.length > 0) {
      return d3.scaleLinear().domain([0, series.length]).range([0, innerWidth]);
    }
  }, [innerWidth, series]);

  const yScale = useCreation(() => {
    if (innerHeight && series && series.length) {
      const maxValue = d3.max(series)!;
      return (
        d3
          .scaleLinear()
          // @ts-ignore
          .domain([0, maxValue])
          .range([innerHeight, 0])
      );
    }
  }, [innerHeight, series]);

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
          {series?.map((item, index) => {
            if (innerHeight && yScale && xScale) {
              return (
                <g key={index}>
                  <rect
                    key={index}
                    width={barAttr.barWidth}
                    height={innerHeight - yScale(item)}
                    transform={`translate(${xScale(index)}, ${yScale(item)})`}
                  ></rect>
                </g>
              );
            } else return <g key={index}></g>;
          })}
        </g>
      </svg>
    </div>
  );
};

export default BarChart;
