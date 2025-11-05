import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategories } from "../data/data";
import { compactNumber } from "../utils";

const ConsumptionByCategories = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      marginLeft: 150,
      grid: true,
      y: { label: null, ticks: 0 },
      fy: {
        label: null,
        axis: "left",
        domain: [
          "Общественное питание",
          "Продовольствие",
          "Здоровье",
          "Маркетплейсы",
          "Транспорт",
        ],
      },
      x: {
        type: "pow",
        exponent: 1 / 3,
        ticks: 10,
      },
      marks: [
        Plot.ruleY([0], { strokeOpacity: 0.1 }),
        Plot.axisX({
          anchor: "top",
          ticks: 10,
          label: "Δ 2023 — 2024, ₽",
          labelOffset: -8,
          tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU"),
        }),
        Plot.axisX({
          anchor: "bottom",
          ticks: 10,
          tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU"),
          label: null,
        }),
        Plot.dot(
          dataConsumptionByYearsByCategories.filter(
            (elem) => elem.category !== "Все категории"
          ),
          Plot.dodgeY("middle", {
            x: "diff",
            fy: "category",
            r: 1,
            fill: (d) => (d.diff <= 0 ? "red" : "black"),
            strokeWidth: 0,
            channels: {
              territory_name: {
                label: "Муниципалитет:",
                value: "territory_name",
              },
              region_name: { label: "Регион:", value: "region_name" },
              diff: { label: "Разница (руб.):", value: "diff" },
              diffPercent: { label: "Разница (%):", value: "diffPercent" },
            },
            tip: {
              format: {
                x: false,
              },
            },
          })
        ),
        Plot.tip(
          [
            dataConsumptionByYearsByCategories
              .filter((elem) => elem.category === "Транспорт" && elem.diff < 0)
              .reduce((acc, curr) => acc + curr.diff, 0)
              .toLocaleString(),
          ],
          {
            x: -15000,
            y: 0,
            fy: (d) => "Транспорт",
            dy: -24,
            fill: "none",
            textPadding: 0,
            color: "#ee4444",
            stroke: "none",
            fontSize: 24,
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByCategories;
