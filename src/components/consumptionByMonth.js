import { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByMonthsMarketplaces } from "../data/dataConsumptionByMonthsMarketplaces";
import { dataConsumptionByMonthsTransport } from "../data/dataConsumptionByMonthsTransport";
import { dataConsumptionByMonthsHealth } from "../data/dataConsumptionByMonthsHealth";
import { dataConsumptionByMonthsFood } from "../data/dataConsumptionByMonthsFood";
import { dataConsumptionByMonthsRestraunts } from "../data/dataConsumptionByMonthsRestraunts";
import { dataConsumptionByMonthsOther } from "../data/dataConsumptionByMonthsOther";
import { SegmentControl } from "./uiSegmentControl";
import { Select } from "./uiSelect";

const ConsumptionByMonth = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  const [activeCategory, setActiveCategory] = useState("Общественное питание");
  const [chartContainerWidth, setChartContainerWidth] = useState(null);

  const categories = [
    "Общественное питание",
    "Продовольствие",
    "Здоровье",
    "Маркетплейсы",
    "Транспорт",
    "Другие категории",
  ];

  const months = Array.from({ length: 12 }, (item, i) => {
    return new Date(0, i).toLocaleString("ru-RU", { month: "long" });
  });

  useEffect(() => {
    const plot = Plot.plot({
      subtitle:
        "Динамика изменения расходов муниципалитетов по месяцам год к году в категории «" +
        activeCategory +
        "»",
      caption:
        "Каждая горизонтальная черта в рамках месяца – муниципальное образование. При одинаковых значениях, интенсивность цвета складывается и показывает плотность распределения. Чем ярче/темнее черный или красный цвет, тем большее количество муниципалитетов сосредоточено в этой области.\n\nКрасный – отрицательная разница (сокращение расходов) со значением в этом месяце год назад. Черный – положительная.",
      width: width,
      height: height,
      marginLeft: 60,
      y: {
        grid: true,
        label: "Разница в расходах 2023 – 2024, ₽",
        ticks: 5,
        tickFormat: (d) => d.toLocaleString("ru-RU"),
      },
      x: { domain: months, label: null },
      marks: [
        Plot.ruleY([0]),
        // Plot.boxY(
        //   activeCategory === "Маркетплейсы"
        //     ? dataConsumptionByMonthsMarketplaces
        //     : activeCategory === "Транспорт"
        //     ? dataConsumptionByMonthsTransport
        //     : activeCategory === "Здоровье"
        //     ? dataConsumptionByMonthsHealth
        //     : activeCategory === "Продовольствие"
        //     ? dataConsumptionByMonthsFood
        //     : activeCategory === "Общественное питание"
        //     ? dataConsumptionByMonthsRestraunts
        //     : dataConsumptionByMonthsOther,
        //   {
        //     x: "month",
        //     y: (d) => d.nextYear - d.prevYear,
        //   }
        // ),
        Plot.tickY(
          activeCategory === "Маркетплейсы"
            ? dataConsumptionByMonthsMarketplaces
            : activeCategory === "Транспорт"
            ? dataConsumptionByMonthsTransport
            : activeCategory === "Здоровье"
            ? dataConsumptionByMonthsHealth
            : activeCategory === "Продовольствие"
            ? dataConsumptionByMonthsFood
            : activeCategory === "Общественное питание"
            ? dataConsumptionByMonthsRestraunts
            : dataConsumptionByMonthsOther,
          {
            x: "month",
            y: (d) => d.nextYear - d.prevYear,
            stroke: (d) =>
              d.nextYear - d.prevYear > 0 ? "rgba(0, 0, 0, 1)" : "#ee4444",
            strokeOpacity: 0.1,
          }
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
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

export default ConsumptionByMonth;
