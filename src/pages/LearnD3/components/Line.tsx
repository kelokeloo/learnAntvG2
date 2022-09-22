import React from "react";
import * as d3 from "d3";
const Line = ({
  xScale,
  yScale,
  color,
  data,
  isSmooth,
  animation,
  ...props
}: any) => {
  const ref = React.useRef(null);

  const line = d3
    .line()
    // @ts-ignore
    .x((d) => xScale(d.date))
    // @ts-ignore
    .y((d) => xScale(d.value));
  const d = line(data) as any;

  return (
    <path
      ref={ref}
      d={d?.match(/NaN|undefined/) ? "" : d}
      stroke={color}
      strokeWidth={3}
      fill="none"
    />
  );
};

export default Line;
