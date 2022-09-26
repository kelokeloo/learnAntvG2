import { useCreation } from "ahooks";
import * as d3 from "d3";
import { useEffect, useState } from "react";

type ToolboxProps<TDataItem> = {
  x: Date;
  data: TDataItem[];
  xAccessor: (x: TDataItem) => Date;
  serializer: d3.Line<TDataItem> | undefined;
  xScale: d3.ScaleTime<number, number, never> | undefined;
  innerHeight: number | undefined;
};

function Toolbox<TDataItem>(props: ToolboxProps<TDataItem>) {
  const { x: date, xAccessor, data, serializer, xScale, innerHeight } = props;
  const [pointValue, setPointValue] = useState<TDataItem>();
  const pos = useCreation(() => {
    if (serializer && date && xScale) {
      const offsetX = xScale(date);
      const bisect = d3.bisector(xAccessor).left;
      const pointValue = data[bisect(data, date)];
      setPointValue(pointValue);
      const offsetY = serializer.y()(pointValue, 0, data);
      return {
        offsetX,
        offsetY: offsetY,
      };
    }
  }, [xAccessor, serializer, date]);

  const [textNode, setTextNode] = useState<SVGTextElement | null>(null);

  const refCallback: React.LegacyRef<SVGTextElement> = (el) => {
    setTextNode(el);
  };
  useEffect(() => {
    if (textNode && data) {
      d3.select(textNode)
        .datum(pointValue)
        .on("click", (event, data) => {
          console.log("click", data);
        });
    }
  }, [textNode, pointValue]);

  return (
    <g>
      <line
        x1={pos?.offsetX}
        y1={pos?.offsetY}
        x2={pos?.offsetX}
        y2={innerHeight}
        stroke="#e0e0e0"
        strokeWidth={1}
      ></line>
      <text
        x={pos?.offsetX}
        y={pos ? pos?.offsetY - 16 : 0}
        textAnchor="middle"
        ref={refCallback}
      >
        {/* @ts-ignore */}
        {pointValue?.close}
      </text>
    </g>
  );
}

export default Toolbox;
