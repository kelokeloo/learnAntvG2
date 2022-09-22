import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GridLine = ({
  type,
  scale,
  ticks,
  size,
  transform,
  disableAnimation,
  ...props
}: any) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "vertical" ? d3.axisBottom : d3.axisLeft;
    const axis = axisGenerator(scale).ticks(ticks).tickSize(-size);

    const gridGroup = d3.select(ref.current);
    if (disableAnimation) {
      // @ts-ignore
      gridGroup.call(axis);
    } else {
      // @ts-ignore
      gridGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    gridGroup.select(".domain").remove();
    gridGroup.selectAll("text").remove();
  }, [scale, ticks, size, disableAnimation]);
  return <g ref={ref} transform={transform} {...props}></g>;
};
export default GridLine;
