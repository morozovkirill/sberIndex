import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataUnitedConsumptionSalary } from "../data/data";
import { compactNumber } from "../utils";

const ConsumptionVsSalary = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      inset: 40,
      x: {
        tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU") + "%",
        label: "Изменение в расходах",
        labelOffset: -8,
      },
      y: {
        tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU") + "%",
        label: "Изменение в заработке",
      },
      marks: [
        Plot.ruleX([0]),
        Plot.ruleY([0]),
        Plot.dot(dataUnitedConsumptionSalary, {
          x: "consDiffPercent",
          y: "salaryDiffPercent",
          stroke: (d) =>
            d.salaryDiffPercent < 0 || d.consDiffPercent < 0
              ? "#ee4444"
              : "black",
          channels: {
            territory_name: {
              label: "Муниципалитет:",
              value: "territory_name",
            },
            region_name: { label: "Регион:", value: "region_name" },
            consDiff: { label: "Разница в тратах:", value: "consDiff" },
            salaryDiff: { label: "Разница в заработке:", value: "salaryDiff" },
          },
          tip: {
            format: {
              x: false,
              y: false,
            },
          },
        }),
        Plot.tip(dataUnitedConsumptionSalary, {
          x: "consDiffPercent",
          y: "salaryDiffPercent",
          filter: (d) =>
            d.consDiffPercent > 80 ||
            d.consDiffPercent < -70 ||
            d.salaryDiffPercent > 50 ||
            d.salaryDiffPercent < -15 ||
            (d.consDiffPercent < 0 && d.salaryDiffPercent < 0),
          title: (d) => d.territory_name,
          fill: "none",
          stroke: "none",
          pathFilter: "none",
          textPadding: 0,
          format: {
            x: false,
            y: false,
          },
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionVsSalary;
