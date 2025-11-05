import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataUnitedConsumptionSalary } from "../data/data";
import { compactNumber } from "../utils";

const SalaryConsumptionByTerritories = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      width: width,
      height: height,
      marginLeft: 150,
      inset: 40,
      x: {
        type: "log",
        grid: true,
        tickFormat: (d) => compactNumber(d).toLocaleString("ru-RU"),
        label: "Среднегодовой заработок, ₽",
        labelOffset: -8,
      },
      y: {
        type: "point",
        tickFormat: (d) =>
          dataUnitedConsumptionSalary.find((elem) => elem.territory_id === d)
            .territory_name,
        grid: true,
        label: null,
      },
      marks: [
        Plot.arrow(
          dataUnitedConsumptionSalary.filter(
            (elem) => elem.salary[2024] < elem.salary[2023]
          ),
          {
            x1: (d) => d.salary[2023],
            x2: (d) => d.salary[2024],
            y: "territory_id",
            stroke: "#ee4444",
          }
        ),
        Plot.text(
          dataUnitedConsumptionSalary.filter(
            (elem) => elem.salary[2024] < elem.salary[2023]
          ),
          {
            x: (d) => d.salary[2024] + (d.salary[2023] - d.salary[2024]) / 2,
            y: "territory_id",
            text: (d) =>
              compactNumber(d.salary[2024] - d.salary[2023]).toLocaleString(
                "ru-RU"
              ),
            textAnchor: "center",
            dy: -12,
            fontSize: (d) => -(d.salary[2024] - d.salary[2023]) / 1500 + 8,
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default SalaryConsumptionByTerritories;
