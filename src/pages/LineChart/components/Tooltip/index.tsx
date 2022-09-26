import { useCreation } from "ahooks";
import * as d3 from "d3";
import moment from "moment";
import { useEffect } from "react";

type TooltipProps<TDataItem> = {
  linePointPos: BaseTypes.TPos;
  xAccessor: (x: TDataItem) => Date;
  data: TDataItem[];
  xScale: d3.ScaleTime<number, number, never> | undefined;
};

function Tooltip<TDataItem>(props: TooltipProps<TDataItem>) {
  const { linePointPos, xAccessor, data, xScale } = props;

  const showData = useCreation(() => {
    if (xScale && linePointPos) {
      const curDate = xScale.invert(linePointPos.offsetX);
      const bisect = d3.bisector<TDataItem, Date>(xAccessor).left;
      return data[bisect(data, curDate)];
    }
  }, [xScale, linePointPos]);

  const offset = {
    x: 16,
    y: -16,
  };

  return (
    <g>
      <defs>
        <filter id="tooltipBg">
          <feFlood
            floodColor="#FFA726"
            floodOpacity="1"
            result="bgMiddleware"
          ></feFlood>
          <feMerge>
            <feMergeNode in="bgMiddleware"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <text
        x={linePointPos ? linePointPos?.offsetX + offset.x : 0}
        y={linePointPos ? linePointPos?.offsetY + offset.y : 0}
        filter="url(#tooltipBg)"
        style={{ color: "white" }}
        stroke="white"
        fill="white"
      >
        date：
        {/* @ts-ignore */}
        {moment(showData?.date).format("YYYY-MM-DD")}
        &nbsp;close：
        {/* @ts-ignore */}
        {showData?.close}
      </text>
    </g>
  );
}

export default Tooltip;
