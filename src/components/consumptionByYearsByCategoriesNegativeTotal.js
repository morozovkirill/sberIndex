import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategoriesNegativeTotal } from "../data/data";
import { compactNumber } from "../utils";

const ConsumptionByYearsByCategoriesNegativeTotal = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      marginLeft: 150,
      y: {
        type: "point",
        tickFormat: (d) =>
          dataConsumptionByYearsByCategoriesNegativeTotal.find(
            (elem) => elem.territory_id === d
          ).territory_name,
        label: null,
      },
      r: { range: [2, 16] },
      grid: true,
      marks: [
        Plot.axisX({ anchor: "top", label: null }),
        Plot.dot(
          dataConsumptionByYearsByCategoriesNegativeTotal.filter(
            (elem) => elem.category !== "Все категории"
          ),
          {
            x: "category",
            y: "territory_id",
            r: (d) => Math.abs(d.diff),
            fill: (d) => (d.diff > 0 ? "black" : "#ee4444"),
            sort: { y: "-r" },
          }
        ),
        Plot.text(
          dataConsumptionByYearsByCategoriesNegativeTotal.filter(
            (elem) => elem.category !== "Все категории"
          ),
          {
            x: "category",
            y: "territory_id",
            text: (d) => compactNumber(d.diff).toLocaleString("ru-RU"),
            textAnchor: "end",
            dx: -24,
            stroke: "white",
            fill: "black",
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByYearsByCategoriesNegativeTotal;
