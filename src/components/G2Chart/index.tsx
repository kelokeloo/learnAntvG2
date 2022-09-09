import { useRef, useEffect, useState } from "react";
import { Chart } from "@antv/g2";
import { useCreation } from "ahooks";

// 表格配置的回调函数接口
export type TChartCfgCallback<TData> = (chart: Chart, data: TData) => void;
// props
export type G2ChartProps<TData> = {
  chartCfg: Partial<Chart>;
  data: TData | undefined;
  configCallback: TChartCfgCallback<TData>;
};

function useChart<TRef = any, TData = any>(
  ref: React.MutableRefObject<TRef>,
  chartConfig: Partial<Chart>,
  data: TData | undefined,
  configCallback: TChartCfgCallback<TData>
) {
  /**
   * 入口
   * chart实例的创建时机: 拿到dom的时候、chartConfig改变的时候
   */
  const chart = useCreation(() => {
    if (ref.current) {
      const chart = new Chart({
        ...chartConfig,
        container: ref.current as unknown as HTMLElement,
      });
      return chart;
    }
  }, [ref.current, chartConfig]);

  /**
   * 配置和渲染
   */
  useEffect(() => {
    if (chart && data && configCallback) {
      configCallback(chart, data);
      chart.render();
    }
    // 及时销毁
    return () => {
      chart?.destroy();
    };
  }, [chart, data, configCallback]);
}
// 布局
function generateLayout(chartCfg) {
  const { width, height } = chartCfg;
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
}

// 组件入口
function G2Chart<TData>(props: G2ChartProps<TData>) {
  const { chartCfg, data, configCallback } = props;
  const ref = useRef(undefined);
  const [chart, setChart] = useState<Chart>();
  // useChart(ref, chartCfg, data, configCallback);

  const refCallback = (node) => {
    console.log("node", node);
    if (node) {
      const chartInstance = new Chart({
        ...chartCfg,
        container: node,
      });
      setChart(chartInstance);
    } else {
      chart?.destroy();
    }
  };
  useEffect(() => {
    if (chart && data && configCallback) {
      configCallback(chart, data);
      chart.render();
    }
    // 及时销毁
    return () => {
      chart?.destroy();
    };
  }, [chart, data, configCallback]);

  return (
    <div
      ref={refCallback}
      className="w-full h-full"
      style={generateLayout(chartCfg)}
    ></div>
  );
}

export default G2Chart;
