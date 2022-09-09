import { Chart } from "@antv/g2";
import { fetchNintendoGameSale } from "./services";
import { useQuery } from "react-query";
import G2Chart, { TChartCfgCallback } from "../../components/G2Chart";

const G2 = () => {
  const { data } = useQuery(["NintendoGameSale"], fetchNintendoGameSale);

  const chartConfig: Partial<Chart> = {
    autoFit: true,
    width: 700,
    height: 500,
  };

  const callback: TChartCfgCallback<{ Date: string; Close: number }[]> = (
    chart,
    data
  ) => {
    chart.data(data);
    console.log("chart", chart);
    chart.line().position("Date*Close").color("Close");
    chart.scale({
      Close: {
        min: 0,
        max: 300,
      },
      Date: {
        tickCount: 15,
      },
    });
  };

  return (
    <>
      <div>
        <G2Chart chartCfg={chartConfig} data={data} configCallback={callback} />
      </div>
    </>
  );
};

export default G2;
