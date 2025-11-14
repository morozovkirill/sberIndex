import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategories } from "../data/data";

const ConsumptionByCategoriesTerritoriesCount = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  const data = [
    ...new Set(dataConsumptionByYearsByCategories.map((elem) => elem.category)),
  ]
    .map((elem) => {
      const obj = {
        category: elem,
        municipals: dataConsumptionByYearsByCategories.filter(
          (item) => item.category === elem && item.diff < 0
        ).length,
      };
      return obj;
    })
    .filter((elem) => elem.category !== "Все категории");

  useEffect(() => {
    const plot = Plot.plot({
      subtitle:
        "Количество муниципалитетов, в которых расходы год к году сократились",
      width: width,
      height: height,
      marginLeft: 150,
      marginRight: 80,
      y: { label: null, grid: false },
      x: {
        axis: null,
        label: "Количество муниципалитетов",
        labelOffset: -8,
      },
      marks: [
        Plot.barX(data, {
          x: "municipals",
          y: "category",
          fill: "rgba(0, 0, 0, .8)",
          sort: { y: "-x" },
        }),
        Plot.text(data, {
          x: "municipals",
          y: "category",
          text: "municipals",
          textAnchor: "start",
          dx: 6,
          fill: "rgba(0, 0, 0, .8)",
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByCategoriesTerritoriesCount;
