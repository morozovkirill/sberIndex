import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import { dataConsumptionNegativeCategoriesSelected } from "../data/data";
import { compactNumber } from "../utils";

const dataCategories = dataConsumptionNegativeCategoriesSelected.filter(
  (d) => d.category !== "Все категории"
);

const ConsumptionByYearsByCategoriesNegativeTotal = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const domain = Array.from(
      d3.group(dataCategories, (d) => d.territory_id),
      (d) => ({
        territory_name: d[1][0].territory_name,
        territory_id: d[1][0].territory_id,
        categories: d[1],
      })
    )
      .sort((a, b) => {
        const prev = a.categories.filter((c) => c.diff < 0);
        const next = b.categories.filter((c) => c.diff < 0);
        return (
          next.length - prev.length ||
          prev.reduce((acc, curr) => (acc += acc + curr.diff), 0) -
            next.reduce((acc, curr) => (acc += acc + curr.diff), 0)
        );
      })
      .map((t) => ({
        territory_id: t.territory_id,
        territory_name: t.territory_name,
      }));

    const plot = Plot.plot({
      subtitle:
        "Муниципалитеты, в которых расходы год к году сократились в 4 и более категриях",
      width: width,
      height: height,
      marginLeft: 150,
      y: {
        type: "point",
        tickFormat: (d) =>
          domain.find((t) => t.territory_id === d).territory_name,
        label: null,
        domain: domain.map((t) => t.territory_id),
      },
      r: { range: [2, 16] },
      grid: true,
      insetLeft: 40,
      marks: [
        Plot.axisX({
          anchor: "top",
          label: null,
          lineWidth: 3,
        }),
        Plot.dot(dataCategories, {
          x: "category",
          y: "territory_id",
          r: (d) => Math.abs(d.diff),
          fill: (d) => (d.diff > 0 ? "none" : "#ee4444"),
          stroke: (d) => (d.diff > 0 ? "#000" : "none"),
          strokeWidth: 1,
        }),
        Plot.text(dataCategories, {
          x: "category",
          y: "territory_id",
          text: (d) => compactNumber(d.diff).toLocaleString("ru-RU"),
          textAnchor: "end",
          dx: -24,
          stroke: "white",
          fill: "black",
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByYearsByCategoriesNegativeTotal;
