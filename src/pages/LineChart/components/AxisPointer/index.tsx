import { useCreation } from "ahooks";
import * as d3 from "d3";
import { round } from "lodash";
import moment from "moment";

type TLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
// 绘制AxisPointer
type AxisPointerProps<TDataItem> = {
  innerWidth: number | undefined;
  innerHeight: number | undefined;
  cursorPos:
    | {
        offsetX: number;
        offsetY: number;
      }
    | undefined;
  xScale: d3.ScaleTime<number, number, never> | undefined;
  yScale: d3.ScaleLinear<number, number, never> | undefined;
  serializer: d3.Line<TDataItem> | undefined;
  dimensions: BaseTypes.TDimensions;
  data: TDataItem[];
  xAccessor: (x: TDataItem) => Date;
};

function AxisPointer<TDataItem>(props: AxisPointerProps<TDataItem>) {
  const {
    innerWidth,
    innerHeight,
    cursorPos,
    xScale,
    yScale,
    serializer,
    dimensions,
    data,
    xAccessor,
  } = props;
  //
  const pointerInfo = useCreation(() => {
    if (
      innerWidth &&
      innerHeight &&
      cursorPos &&
      xScale &&
      yScale &&
      serializer &&
      dimensions
    ) {
      const curDate = xScale.invert(cursorPos.offsetX);
      // 二分访问器
      // d3.bisector()

      const bisect = d3.bisector<TDataItem, typeof curDate>(xAccessor).left;
      const yOffset = serializer.y()(data[bisect(data, curDate)], 0, data);

      //
      const curMoment = moment(curDate);
      const curClose = yScale.invert(yOffset);
      const xLabel = curMoment.format("YYYY-MM-DD");
      const yLabel = round(curClose);

      const horizontal: TLine = {
        x1: 0,
        y1: yOffset,
        x2: innerWidth,
        y2: yOffset,
      };
      const vertical: TLine = {
        x1: cursorPos.offsetX,
        y1: 0,
        x2: cursorPos.offsetX,
        y2: innerHeight,
      };

      const horizontalLabel = {
        x: -dimensions.margin.left,
        y: yOffset,
        label: yLabel,
        textAnchor: "right",
      };

      const verticalLabel = {
        x: cursorPos.offsetX,
        y: innerHeight + 16,
        label: xLabel,
        textAnchor: "middle",
      };

      return {
        lines: [horizontal, vertical],
        labels: [horizontalLabel, verticalLabel],
      };
    }
  }, [
    innerWidth,
    innerHeight,
    cursorPos,
    xScale,
    yScale,
    serializer,
    dimensions,
  ]);
  return (
    <g>
      <defs>
        <filter id="labelBackground">
          <feFlood
            floodColor={"white"}
            floodOpacity="1"
            result="bgMiddleware"
          ></feFlood>
          <feMerge>
            <feMergeNode in="bgMiddleware" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {pointerInfo?.lines?.map((item, index) => (
        <line key={index} {...item} stroke="#e0e0e0"></line>
      ))}
      {pointerInfo?.labels?.map((item, index) => (
        <text
          filter="url(#labelBackground)"
          x={item.x}
          y={item.y}
          fill="black"
          textAnchor={item.textAnchor}
          style={{ backgroundColor: "black" }}
        >
          {item.label}
        </text>
      ))}
    </g>
  );
}

export default AxisPointer;
