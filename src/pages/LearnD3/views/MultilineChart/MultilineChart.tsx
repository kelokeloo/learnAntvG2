import React from "react";
import { GridLine, Axis, Line } from "../../components";
import useController from "./MultilineChart.controller";

const MultilineChart = ({ data = [], dimensions }) => {
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const controller = useController({ data, width, height });
  const { yTickFormat, xScale, yScale, yScaleForAxis } = controller;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <GridLine
          type="vertical"
          scale={xScale}
          ticks={5}
          size={height}
          transform={`translate(0,${height})`}
        />
        <GridLine
          type="horizontal"
          scale={yScaleForAxis}
          ticks={2}
          size={width}
        />
        {data.map(({ name, items = [], color }) => (
          <Line
            key={name}
            data={items}
            xScale={xScale}
            yScale={yScale}
            color={color}
          ></Line>
        ))}
        <Axis
          type="left"
          scale={yScaleForAxis}
          ticks={5}
          transform="translate(50, -10)"
          tickFormat={yTickFormat}
        />
        <Axis
          type="bottom"
          className="axisX"
          scale={xScale}
          transform={`translate(10, ${height - height / 6})`}
          ticks={5}
        />
      </g>
    </svg>
  );
};
export default MultilineChart;
