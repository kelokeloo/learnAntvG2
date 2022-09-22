import * as d3 from "d3";

export const getXScale = (data, width) =>
  d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);

export const getYScale = (data, height, intention) =>
  d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.value) - intention,
      d3.max(data, (d) => d.value) + intention,
    ])
    .range([height, 0]);

const applyAxisStyles = (container) => {
  container.select(".domain").remove();
  container.selectAll("line");
  return container.selectAll("text").attr("font-size", "0.75rem");
};

export const drawAxis = ({
  container,
  xScale,
  yScale,
  ticks,
  tickSize,
  tickFormat,
  transform,
}) => {
  const scale = xScale || yScale;
  const axisType = xScale ? d3.axisBottom : d3.axisLeft;
  const axis = axisType(scale)
    .ticks(ticks)
    .tickSize(tickSize)
    .tickFormat(tickFormat);
  const axisGroup = container
    .append("g")
    .attr("class", axis)
    .attr("transform", transform)
    .call(axis);
  return applyAxisStyles(axisGroup);
};

export const drawLine = ({ container, data, xScale, yScale }) => {
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
  return container
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", (d) => d.color)
    .attr("stroke-width", 3)
    .attr("d", (d) => line(d.items));
};

export const animateLine = ({ element }) => {
  const length = element.getTotalLength();
  return d3.select(element).attr("stroke-dasharray", `${length},${length}`);
};
