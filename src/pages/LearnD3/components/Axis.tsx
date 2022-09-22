import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Axis = ({
  type,
  scale,
  ticks,
  transform,
  tickFormat,
  disableAnimation,
  ...props
}: any) => {
  const ref = useRef(null);
  useEffect(() => {
    const axisGenerator = type === "left" ? d3.axisLeft : d3.axisBottom;
    const axis = axisGenerator(scale).ticks(ticks).tickFormat(tickFormat);

    const axisGroup = d3.select(ref.current);

    if (disableAnimation) {
      // @ts-ignore
      axisGroup.call(axis);
    } else {
      // @ts-ignore
      axisGroup.transition().duration(750).ease(d3.easeLinear).call(axis);
    }
    axisGroup.select(".domain").remove();
    axisGroup.selectAll("line").remove();
  }, [scale, ticks, tickFormat, disableAnimation]);

  return <g ref={ref} transform={transform} {...props}></g>;
};

export default Axis;
