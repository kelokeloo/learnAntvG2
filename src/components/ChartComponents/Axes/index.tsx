import React from "react";
import * as d3 from "d3";

const Axis = () => {
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el) {
    }
  };

  return <g ref={refCallback}></g>;
};

export default Axis;
