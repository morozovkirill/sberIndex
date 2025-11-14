import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataUnitedConsumptionSalary } from "../data/data";
import { compactNumber } from "../utils";

const SalaryByTerritories = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const plot = Plot.plot({
      subtitle:
        "Муниципалитеты, в которых год к году сократились заработные платы",
      caption:
        "Разница в среднем заработоке за январь–декабрь 2024 и 2023 годов. В выборке участвуют только те муниципалитеты, по которым есть полные данные (все месяцы в течение двух лет).",
      width: width,
      height: height,
      marginLeft: 150,
      inset: 40,
      x: {
        type: "log",
        grid: true,
        tickFormat: (d) => (d / 1000).toLocaleString("ru-RU"),
        label: "Среднегодовой заработок, тыс. ₽",
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
            fontSize: (d) => -(d.salary[2024] - d.salary[2023]) / 1000 + 8,
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default SalaryByTerritories;
