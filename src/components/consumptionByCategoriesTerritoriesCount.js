import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategories } from "../data/data";

const ConsumptionByCategoriesTerritoriesCount = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      marginLeft: 150,
      y: { label: null, grid: false },
      x: {
        grid: true,
        label: "Количество муниципалитетов",
        labelOffset: -8,
      },
      marks: [
        Plot.barX(
          [
            ...new Set(
              dataConsumptionByYearsByCategories.map((elem) => elem.category)
            ),
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
            .filter((elem) => elem.category !== "Все категории"),
          {
            x: "municipals",
            y: "category",
            fill: "rgba(0, 0, 0, .8)",
            sort: { y: "-x" },
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByCategoriesTerritoriesCount;
