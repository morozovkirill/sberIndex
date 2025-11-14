import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { dataConsumptionByYearsByCategories } from "../data/data";
import { compactNumber } from "../utils";

function sLine(context, gapX = 10, gapY = 10, reversed = false) {
  return new SLine(context, gapX, gapY, reversed);
}

function SLine(context, gapX, gapY, reversed) {
  this._context = context;
  this._gapX = gapX;
  this._gapY = gapY;
  this._reversed = reversed;
}

SLine.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || (this._line !== 0 && this._point === 1))
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x;
    y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;
      case 1:
        this._point = 2; // falls thgough
      default: {
        if (this._reversed) {
          this._context.lineTo(this._x, this._y - this._gapY);
          this._context.lineTo(x, y - this._gapY);
          this._context.lineTo(x, y);
        } else {
          this._context.lineTo(this._x, this._y + this._gapY);
          this._context.lineTo(x, y + this._gapY);
          this._context.lineTo(x, y);
        }
        break;
      }
    }
    this._x = x;
    this._y = y;
  },
};

const ConsumptionByCategories = (props) => {
  const { width, height } = props;

  const containerRef = useRef();

  const categories = [
    "Общественное питание",
    "Продовольствие",
    "Транспорт",
    "Маркетплейсы",
    "Здоровье",
    "Другие категории",
  ];

  const summary = categories
    .map((elem) => {
      const positive = dataConsumptionByYearsByCategories.filter(
        (item) => item.category === elem && item.diff > 0
      );
      const summaryPositive = positive.reduce(
        (acc, curr) => acc + curr.diff,
        0
      );
      const minPositive = positive.length
        ? Math.min(...positive.map((elem) => elem.diff))
        : null;
      const maxPositive = positive.length
        ? Math.max(...positive.map((elem) => elem.diff))
        : null;

      const negative = dataConsumptionByYearsByCategories.filter(
        (item) => item.category === elem && item.diff <= 0
      );
      const summaryNegative = negative.reduce(
        (acc, curr) => acc + curr.diff,
        0
      );
      const minNegative = negative.length
        ? Math.min(...negative.map((elem) => elem.diff))
        : null;
      const maxNegative = negative.length
        ? Math.max(...negative.map((elem) => elem.diff))
        : null;

      return [
        {
          category: elem,
          type: "positive",
          value: summaryPositive,
          min: minPositive,
          max: maxPositive,
          count: positive.length,
        },
        {
          category: elem,
          type: "negative",
          value: summaryNegative,
          min: minNegative,
          max: maxNegative,
          count: negative.length,
        },
      ];
    })
    .flat();

  useEffect(() => {
    const plot = Plot.plot({
      title: "Как менялись расходы в 2023 / 24 годах по мунициалитетам",
      subtitle:
        "На графике разница всех средних безналичных расходов по месяцам в течение года",
      caption:
        "Точка на графике – муниципальное образование. Распределение по горизонтали строится на основе разницы сумм средних месячных расходов за год (сумма средних месячных расходов за 2024 минус сумма за 2023). Распределение по вертикали основано на количестве МО с одинаковым или схожим значением в разнице расходов.\n\nВ выборке участвуют только те МО, по которым есть полные данные (расходы за все месяцы в течение двух лет).",
      width: width,
      height: height,
      marginLeft: 150,
      grid: true,
      y: { label: null, ticks: 0 },
      fy: {
        label: "Категории расходов",
        axis: "left",
        domain: categories,
        padding: 0,
      },
      x: {
        type: "pow",
        exponent: 1 / 3,
        ticks: 10,
      },
      length: { range: [90, 120], domain: [6, 9] },
      marks: [
        Plot.ruleY([0], { strokeOpacity: 0.1 }),
        Plot.axisX({
          anchor: "top",
          ticks: 10,
          label: "Δ 2023 — 2024, тыс. ₽",
          labelOffset: -10,
          tickFormat: (d) => d / 1000,
        }),
        Plot.axisX({
          anchor: "bottom",
          ticks: 10,
          tickFormat: (d) => d / 1000,
          label: null,
        }),
        Plot.dot(
          dataConsumptionByYearsByCategories.filter(
            (elem) => elem.category !== "Все категории"
          ),
          Plot.dodgeY("middle", {
            x: "diff",
            fy: "category",
            r: 1,
            fill: (d) => (d.diff <= 0 ? "red" : "black"),
            strokeWidth: 0,
            channels: {
              territory_name: {
                label: "Муниципалитет:",
                value: "territory_name",
              },
              region_name: { label: "Регион:", value: "region_name" },
              diff: {
                label: "Разница:",
                value: (d) =>
                  compactNumber(d.diff).toLocaleString() +
                  " ₽" +
                  " (" +
                  (Math.round(d.diffPercent * 10) / 10).toLocaleString(
                    "ru-RU"
                  ) +
                  "%)",
              },
            },
            tip: {
              format: {
                x: false,
                fy: false,
              },
            },
          })
        ),

        // Notes
        Plot.text(
          ["Суммарное сокращение расходов в категории\nпо муниципалитетам"],
          {
            x: -3000,
            fy: (d) => "Общественное питание",
            dy: 140,
            textAnchor: "center",
            fill: "black",
            stroke: "white",
            strokeWidth: 8,
          }
        ),
        Plot.vector([0], {
          x: -3000,
          fy: (d) => "Общественное питание",
          dy: 120,
          length: 60,
          rotate: -30,
          strokeWidth: 1,
          bend: false,
          wingRatio: 0,
          r: 0,
          anchor: "start",
        }),
        Plot.text(
          [
            "В категории «Маркетплейсы»\nсокращения расходов нет ни в одном\nмуниципалитете",
          ],
          {
            x: -3000,
            fy: (d) => "Маркетплейсы",
            dy: -80,
            textAnchor: "center",
            fill: "black",
            stroke: "white",
            strokeWidth: 8,
          }
        ),
        Plot.vector([0], {
          x: -3000,
          fy: (d) => "Маркетплейсы",
          dy: -50,
          length: 60,
          rotate: 150,
          strokeWidth: 1,
          bend: false,
          wingRatio: 0,
          r: 0,
          anchor: "start",
        }),

        // summary lines
        categories.map((elem, i) => {
          const c = summary.filter(
            (item) =>
              elem === item.category &&
              item.type === "negative" &&
              (item.min !== null) & (item.max !== null)
          );
          const yOffset =
            elem === "Общественное питание"
              ? 32
              : elem === "Продовольствие"
              ? 8
              : elem === "Здоровье"
              ? 24
              : elem === "Маркетплейсы"
              ? 0
              : elem === "Транспорт"
              ? 40
              : 24;
          return c.length
            ? [
                Plot.lineX(
                  c.map((item) => [{ x: item.min }, { x: item.max }]).flat(),
                  {
                    x: "x",
                    y: 0,
                    dy: yOffset,
                    fy: (d) => elem,
                    curve: (context) => sLine(context, 8, 8),
                    stroke: "rgba(0, 0, 0, .8)",
                    strokeWidth: 1,
                  }
                ),
                Plot.text(
                  c.map((item) => ({
                    x: item.min,
                    value: item.value,
                    count: item.count,
                  })),
                  {
                    x: "x",
                    fy: (d) => elem,
                    dy: yOffset + 22,
                    textAnchor: "start",
                    text: (d) =>
                      compactNumber(d.value) +
                      " ₽, " +
                      compactNumber(d.count) +
                      " МО",
                  }
                ),
              ]
            : null;
        }),

        categories.map((elem, i) => {
          const c = summary.filter(
            (item) =>
              elem === item.category &&
              item.type === "positive" &&
              (item.min !== null) & (item.max !== null)
          );
          const yOffset =
            elem === "Общественное питание"
              ? 80
              : elem === "Продовольствие"
              ? 140
              : elem === "Здоровье"
              ? 120
              : elem === "Маркетплейсы"
              ? 170
              : elem === "Транспорт"
              ? 80
              : 70;
          return c.length
            ? [
                Plot.lineX(
                  c.map((item) => [{ x: item.min }, { x: item.max }]).flat(),
                  {
                    x: "x",
                    y: 0,
                    dy: yOffset,
                    fy: (d) => elem,
                    curve: (context) => sLine(context, 8, 8),
                    stroke: "rgba(0, 0, 0, .8)",
                    strokeWidth: 1,
                  }
                ),
                Plot.text(
                  c.map((item) => ({
                    x: item.max,
                    value: item.value,
                    count: item.count,
                  })),
                  {
                    x: "x",
                    fy: (d) => elem,
                    dy: yOffset + 22,
                    textAnchor: "end",
                    text: (d) =>
                      compactNumber(d.value) +
                      " ₽, " +
                      compactNumber(d.count) +
                      " МО",
                  }
                ),
              ]
            : null;
        }),

        // legend
        Plot.text(["Увеличение расходов →"], {
          x: 0,
          fy: (d) => "Общественное питание",
          textAnchor: "start",
          dx: 8,
          dy: -130,
        }),
        Plot.text(["← Уменьшение расходов"], {
          x: 0,
          fy: (d) => "Общественное питание",
          textAnchor: "end",
          dx: -8,
          dy: -130,
        }),

        Plot.text(
          dataConsumptionByYearsByCategories
            .filter((elem) => elem.category === "Общественное питание")
            .sort((a, b) => a.diff - b.diff),
          Plot.selectFirst({
            x: "diff",
            fy: (d) => "Общественное питание",
            textAnchor: "center",
            dy: -24,
            text: (d) => d.territory_name + " МО,\n" + d.region_name,
          })
        ),
        Plot.dot(
          dataConsumptionByYearsByCategories
            .filter((elem) => elem.category === "Общественное питание")
            .sort((a, b) => a.diff - b.diff),
          Plot.selectFirst({
            x: "diff",
            fy: (d) => "Общественное питание",
            r: 4,
            strokeWidth: 1,
          })
        ),
      ],
      style: { overflow: "visible" },
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default ConsumptionByCategories;
