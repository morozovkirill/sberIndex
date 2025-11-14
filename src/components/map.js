import { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { rewind, compactNumber } from "../utils";
import { dataConsumptionByYears } from "../data/dataConsumptionByYears";
import { dataRussia } from "../data/geoRussia";
import { SegmentControl } from "./uiSegmentControl";
import { Select } from "./uiSelect";

const Map = (props) => {
  const { width, height } = props;

  const containerRef = useRef();
  const longitude = 100;
  const angle = 30;

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

  useEffect(() => {
    const plot = Plot.plot({
      subtitle:
        "Изменение расходов в категории «" +
        activeCategory +
        "» в 23023 / 24 годах",
      width: width,
      height: height,
      projection: {
        type: "transverse-mercator",
        domain: dataRussia,
        rotate: [-longitude, -angle],
        // inset,
        // insetLeft,
        // insetTop,
      },
      color: {
        type: "diverging",
        range: ["#ee4444", "white", "rgba(0, 0, 0, .8)"],
        legend: true,
        tickFormat: (d) => d + "%",
      },
      marks: [
        Plot.geo(dataRussia, {
          stroke: "black",
          strokeWidth: 0.1,
          fill: (d) => {
            const e = dataConsumptionByYears.find(
              (elem) => elem.territory_id === +d.properties.territory_id
            );
            return e
              ? e.categories.find((c) => c.category === activeCategory)
                  .diffPercent
              : 0;
          },
          channels: {
            territory_name: {
              label: "Муниципалитет:",
              value: (d) => {
                const e = dataConsumptionByYears.find(
                  (elem) => elem.territory_id === +d.properties.territory_id
                );
                return e ? e.territory_name : "";
              },
            },
            region_name: {
              label: "Регион:",
              value: (d) => {
                const e = dataConsumptionByYears.find(
                  (elem) => elem.territory_id === +d.properties.territory_id
                );
                return e ? e.region_name : "";
              },
            },
            diff: {
              label: "Разница:",
              value: (d) => {
                const e = dataConsumptionByYears.find(
                  (elem) => elem.territory_id === +d.properties.territory_id
                );
                const diff = e
                  ? e.categories.find((c) => c.category === activeCategory).diff
                  : null;
                const diffPercent = e
                  ? e.categories.find((c) => c.category === activeCategory)
                      .diffPercent
                  : null;
                return diff && diffPercent
                  ? compactNumber(diff) +
                      " ₽" +
                      " (" +
                      (Math.round(diffPercent * 10) / 10).toLocaleString(
                        "ru-RU"
                      ) +
                      "%)"
                  : "";
              },
            },
          },
          tip: {
            format: {
              x: false,
              fy: false,
              fill: false,
            },
          },
        }),
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

export default Map;
