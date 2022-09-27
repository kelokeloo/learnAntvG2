import { useCreation, useSize } from "ahooks";
import data from "./data/data.json";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const PieChart = () => {
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

  type TDatum = {
    name: string;
    value: number;
  };
  const arc = d3.arc<TDatum>().innerRadius(0).outerRadius(100);

  const PieData = useCreation(() => {
    if (data) {
      // @ts-ignore
      return d3.pie<datum>().value((d) => d.value)(data);
    }
  }, [data]);

  useEffect(() => {
    console.log("PieData", PieData);
  }, [PieData]);

  const [svgNode, setSvgNode] = useState<SVGSVGElement | null>(null);

  const svgCallback: React.LegacyRef<SVGSVGElement> = (el) => {
    setSvgNode(el);
  };

  const mainContainerOffset = useCreation(() => {
    if (dimensions) {
      return {
        x: dimensions.margin.left,
        y: dimensions.margin.top,
      };
    }
  }, [dimensions]);

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

  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(data.map((item) => item.name))
    .range(d3.schemePaired);

  useEffect(() => {
    d3.selectAll(".pie-chart-pie")
      .on("mouseenter", (event) => {
        const { target } = event;
        d3.select(target)
          .transition()
          .duration(200)
          .attr("transform", `scale(1.1 1.1)`)
          .attr("cursor", "pointer");
      })
      .on("mouseleave", (event) => {
        const { target } = event;
        d3.select(target)
          .transition()
          .duration(200)
          .attr("transform", `scale(1 1)`)
          .attr("cursor", "default");
      });
  }, []);

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
          <g
            transform={`translate(${innerWidth ? innerWidth / 2 : 0} ${
              innerHeight ? innerHeight / 2 : 0
            })`}
          >
            {PieData?.map((item) => (
              // @ts-ignore
              <path
                d={arc(item)}
                fill={colorScale(item.data.name)}
                className="pie-chart-pie"
              ></path>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PieChart;
