import * as d3 from "d3";
import { useState, useEffect } from "react";

type LineProps<T> = {
  data: T[];
  serializer: d3.Line<T> | undefined;
};

function Line<T>(props: LineProps<T>) {
  const { data, serializer } = props;
  const [lineNode, setLineNode] = useState<SVGPathElement | null>(null);

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
}

export default Line;
