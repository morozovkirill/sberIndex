import { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import { dataUnitedConsumptionSalaryCategories } from "../data/data";
import { compactNumber } from "../utils";
import { SegmentControl } from "./uiSegmentControl";
import { Select } from "./uiSelect";

const ConsumptionVsSalary = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  const [activeCategory, setActiveCategory] = useState("Общественное питание");
  const [data, setData] = useState(
    dataUnitedConsumptionSalaryCategories.filter(
      (elem) => elem.category === activeCategory
    )
  );
  const [chartContainerWidth, setChartContainerWidth] = useState(null);

  const categories = [
    "Общественное питание",
    "Продовольствие",
    "Здоровье",
    "Маркетплейсы",
    "Транспорт",
    "Другие категории",
    "Все категории",
  ];

  useEffect(() => {
    const plot = Plot.plot({
      subtitle:
        "Соотношение изменений заработных плат и расходов в муниципальных образованиях в категории «" +
        activeCategory +
        "»",
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
        ticks: 6,
      },
      marks: [
        Plot.ruleX([0]),
        Plot.ruleY([0]),
        Plot.dot(data, {
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
            consDiff: {
              label: "Разница в тратах:",
              value: (d) =>
                compactNumber(d.consDiff) +
                " ₽" +
                " (" +
                Math.round(d.consDiffPercent * 10) / 10 +
                "%)",
            },
            salaryDiff: {
              label: "Разница в заработке:",
              value: (d) =>
                compactNumber(d.salaryDiff) +
                " ₽" +
                " (" +
                (Math.round(d.salaryDiffPercent * 10) / 10).toLocaleString(
                  "ru-RU"
                ) +
                "%)",
            },
          },
          tip: {
            format: {
              x: false,
              y: false,
            },
          },
        }),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  useEffect(() => {
    setData(
      dataUnitedConsumptionSalaryCategories.filter(
        (elem) => elem.category === activeCategory
      )
    );
  }, [activeCategory]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setChartContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(element);

    // Cleanup the observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "40px",
      }}
    >
      {chartContainerWidth < 1000 ? (
        <Select
          data={categories}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
        />
      ) : (
        <SegmentControl
          data={categories}
          setActiveCategory={setActiveCategory}
          activeCategory={activeCategory}
        />
      )}
      <div ref={containerRef} />
    </div>
  );
};

export default ConsumptionVsSalary;
