import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategories } from "../data/data";
import { dataConsumptionByYears } from "../data/dataConsumptionByYears";
import { compactNumber } from "../utils";

const ConsumptionByCategoriesRubles = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      marginRight: 150,
      y: { label: null, axis: "right" },
      x: {
        grid: true,
        tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU"),
        label: "Δ расходов 2023 — 2024, ₽",
        labelArrow: "left",
        labelAnchor: "left",
        labelOffset: -90,
      },
      marks: [
        Plot.barX(
          [
            ...new Set(
              dataConsumptionByYearsByCategories.map((elem) => elem.category)
            ),
          ]
            .map((elem) => {
              const prevYear = dataConsumptionByYearsByCategories
                .filter((item) => item.category === elem && item.diff < 0)
                .map((e) => {
                  const value = dataConsumptionByYears
                    .find((item) => item.territory_id === e.territory_id)
                    .categories.find((item) => item.category === e.category)
                    .years.find((item) => item[0] === "2023")[1];
                  return value;
                })
                .reduce((acc, curr) => acc + curr, 0);

              const nextYear = dataConsumptionByYearsByCategories
                .filter((item) => item.category === elem && item.diff < 0)
                .map((e) => {
                  const value = dataConsumptionByYears
                    .find((item) => item.territory_id === e.territory_id)
                    .categories.find((item) => item.category === e.category)
                    .years.find((item) => item[0] === "2024")[1];
                  return value;
                })
                .reduce((acc, curr) => acc + curr, 0);

              // const diff = Math.abs(nextYear - prevYear)*100/prevYear
              const diff = Math.abs(nextYear - prevYear);

              const obj = {
                category: elem,
                diff: -diff,
              };
              return obj;
            })
            .filter((elem) => elem.category !== "Все категории"),
          { x: "diff", y: "category", fill: "#ee4444", sort: { y: "-x" } }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByCategoriesRubles;
