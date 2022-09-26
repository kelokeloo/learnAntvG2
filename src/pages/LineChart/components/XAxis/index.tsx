import * as d3 from "d3";

// 绘制x轴
type AxisProps = {
  position: { x: number; y: number } | undefined;
  scale: d3.ScaleTime<number, number, never> | undefined;
};

const XAxis = (props: AxisProps) => {
  const { position, scale } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && scale && position) {
      const axis = d3.axisBottom(scale);
      d3.select(el)
        .call(axis)
        .attr("transform", `translate(${position.x} ${position.y})`);
    }
  };
  return <g ref={refCallback}></g>;
};

export default XAxis;
