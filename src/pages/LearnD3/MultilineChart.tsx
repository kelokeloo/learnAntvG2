import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { getXScale, getYScale, drawAxis, drawLine, animateLine } from "./utils";

type TMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TDimensions = {
  width: number;
  height: 300;
  margin: TMargin;
};

type TDataItem = {
  date: Date;
  marketvalue: number;
  value: number;
};

type TSeries = {
  name: string;
  color: string;
  items: Array<TDataItem>;
};

type MultilineChartProps = {
  data: TSeries[];
  dimensions: TDimensions;
};

const MultilineChart = (props: MultilineChartProps) => {
  const { data = [], dimensions } = props;
  const svgRef = useRef(null);

  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  // useEffect(() => {
  //   data[0].items;
  //   const xScale = d3
  //     .scaleTime()
  //     // @ts-ignore
  //     .domain(d3.extent(data[0].items, (d) => d.date))
  //     .range([0, width]);
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([
  //       // @ts-ignore
  //       d3.min(data[0].items, (d) => d.value) - 50,
  //       // @ts-ignore
  //       d3.max(data[0].items, (d) => d.value) + 50,
  //     ])
  //     .range([height, 0]);
  //   const svgEl = d3.select(svgRef.current);
  //   svgEl.selectAll("*").remove(); // 渲染前先清空
  //   const svg = svgEl
  //     .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   // Add X grid lines with labels
  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .ticks(10)
  //     .tickSize(-height + margin.bottom);
  //   const xAxisGroup = svg
  //     .append("g")
  //     .attr("transform", `translate(0, ${height - margin.bottom})`)
  //     .call(xAxis);
  //   xAxisGroup.select(".domain").remove();
  //   xAxisGroup.selectAll("line");
  //   xAxisGroup
  //     .selectAll("text")
  //     .attr("opacity", 0.5)
  //     .attr("font-size", "0.75rem");

  //   // Y grid lines
  //   const yAxis = d3
  //     .axisLeft(yScale)
  //     .ticks(5)
  //     .tickSize(-width + margin.left)
  //     .tickFormat((val) => `${val}%`);
  //   const yAxisGroup = svg.append("g").call(yAxis);
  //   yAxisGroup.select(".domain").remove();
  //   yAxisGroup.selectAll("line");
  //   yAxisGroup
  //     .selectAll("text")
  //     .attr("opacity", 0.5)
  //     .attr("font-size", "0.75rem");

  //   // draw the line
  //   const line = d3
  //     .line()
  //     //@ts-ignore
  //     .x((d) => xScale(d.date))
  //     //@ts-ignore
  //     .y((d) => yScale(d.value));
  //   const lines = svg
  //     .selectAll(".line")
  //     .data(data)
  //     .enter()
  //     .append("path")
  //     .attr("fill", "none")
  //     .attr("stroke", (d) => d.color)
  //     .attr("stroke-width", 3)
  //     // @ts-ignore
  //     .attr("d", (d) => line(d.items));

  //   lines.each((d, i, nodes) => {
  //     const element = nodes[i];
  //     const length = element.getTotalLength();
  //     d3.select(element)
  //       // .attr("stroke", "red")
  //       .attr("stroke-dasharray", `${length},${length}`)
  //       .attr("stroke-dashoffset", length)
  //       .transition()
  //       .duration(750)
  //       .ease(d3.easeLinear)
  //       .attr("stroke-dashoffset", 0);
  //   });
  // }, [data, margin]);

  const [portfolioData] = data;
  const xScale = useMemo(
    () => getXScale(portfolioData.items, width),
    [portfolioData, width]
  );

  const yScale = useMemo(
    () => getYScale(portfolioData.items, height, 50),
    [portfolioData, width]
  );

  useEffect(() => {
    const svg = d3.select(".container");
    svg.selectAll(".axis").remove();

    if (svg) {
      // @ts-ignore
      drawAxis({
        xScale,
        container: svg,
        tickSize: -height + margin.bottom,
        ticks: 5,
        transform: `translate(0,${height - margin.bottom})`,
      });

      // @ts-ignore
      drawAxis({
        yScale,
        container: svg,
        tickSize: -width,
        ticks: 5,
        tickFormat: (val) => `${val}%`,
      });
    }
  }, [xScale, yScale, width, height, margin]);

  // 划线
  useEffect(() => {
    const svg = d3.select(".container");
    svg.selectAll("path").remove();
    data.forEach((d) => {
      const line = drawLine({ container: svg, data: d, xScale, yScale });
      animateLine({ element: line.node() });
    });
  }, [data, xScale, yScale]);

  return (
    <svg ref={svgRef} width={svgWidth} height={svgHeight}>
      <g
        className="container"
        transform={`translate(${margin.left},${margin.top})`}
      />
    </svg>
  );
};

export default MultilineChart;
