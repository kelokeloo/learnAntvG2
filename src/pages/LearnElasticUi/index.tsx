import React from "react";
import "@elastic/eui/dist/eui_theme_light.css";

import {
  Chart,
  Axis,
  BarSeries,
  Position,
  ScaleType,
  Settings,
} from "@elastic/charts";

export default function LearnElasticUi() {
  return (
    <div className="App">
      <Chart size={["100%", 500]}>
        <Settings showLegend />
        <Axis id="count" title="count" position={Position.Left} />
        <Axis id="x" title="goods" position={Position.Bottom} />
        <BarSeries
          id="bars"
          name="amount"
          xScaleType={ScaleType.Ordinal}
          xAccessor="x"
          yAccessors={["y"]}
          data={[
            { x: "trousers", y: 390 },
            { x: "watches", y: 23 },
            { x: "bags", y: 750 },
            { x: "cocktail dresses", y: 854 },
          ]}
        />
      </Chart>
    </div>
  );
}
