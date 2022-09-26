import * as d3 from "d3";

type YAxisProps = {
  scale: d3.ScaleLinear<number, number, never> | undefined;
};

// 绘制y轴
const YAxis = (props: YAxisProps) => {
  const { scale } = props;
  const refCallback: React.LegacyRef<SVGGElement> = (el) => {
    if (el && scale) {
      const axis = d3.axisLeft(scale);
      d3.select(el).call(axis);
    }
  };
  return <g ref={refCallback}></g>;
};

export default YAxis;
