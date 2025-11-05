import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { dataConsumptionByYears } from "../data/dataConsumptionByYears";
import Tooltip from "./tooltip";

const circle = d3
  .arc()
  .innerRadius(0)
  .outerRadius((d) => d)
  .startAngle(-Math.PI)
  .endAngle(Math.PI);

var count = 0;

export function uid(name) {
  return new Id("O-" + (name == null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, window.location) + "";
}

Id.prototype.toString = function () {
  return "url(" + this.href + ")";
};

const BubblesForce = (props) => {
  const { measure, width, height } = props;

  const [tooltipState, setTooltipState] = useState({
    isVisible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const dataByRegions = Array.from(
        d3.group(
          dataConsumptionByYears
            .map((elem) => {
              const valueRubles = Math.abs(elem.diff);
              const valuePercent = Math.abs(elem.diffPercent);
              return {
                territory_name: elem.territory_name,
                territory_id: elem.territory_id,
                region_name: elem.region_name,
                region_id: elem.region_id,
                value: measure ? valueRubles : valuePercent,
                valueRubles: valueRubles,
                valuePercent: valuePercent,
                isPositive: elem.diff > 0,
              };
            })
            .sort((a, b) => b.value - a.value),
          (d) => d.region_id
        ),
        ([, children]) => ({ children })
      );

      const data = { children: [...dataByRegions] };
      const root = d3
        .pack()
        .size([width, height])
        .padding((d) => (d.depth === 0 ? 24 : 4))(
        d3.hierarchy(data).sum((d) => d.value)
      );
      const maxValue = Math.max(
        ...root
          .descendants()
          .filter((d) => d.height === 1)
          .map((elem) => elem.value)
      );
      const scale = d3.scaleLinear([0, maxValue], [8, 21]);

      const simulation = d3
        .forceSimulation(root.descendants().filter((d) => d.height === 1))
        .force(
          "collide",
          d3.forceCollide((d) => d.r + scale(d.value / 2))
        )
        .force(
          "center",
          d3.forceCenter(width / 2 + (measure ? 0 : -40), height / 2)
        )
        .force("x", d3.forceX().strength(0))
        .force("y", d3.forceY().strength(0.018));

      const svg = d3.select(chartRef.current.firstChild);
      svg.selectAll("g").remove();

      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, -0, width, height])
        .attr("style", "overflow: visible")
        .attr("text-anchor", "middle");

      const node = svg
        .append("g")
        .attr("pointer-events", "all")
        .selectAll("g")
        .data(root.descendants().filter((d) => d.height === 1))
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      node
        .append("path")
        .attr("id", (d) => (d.circleUid = uid("circle")).id)
        .attr("stroke", "none")
        // .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("d", (d) => circle(d.r + scale(d.value) / 2));

      node.append("text").call((text) =>
        text
          .append("textPath")
          .attr("xlink:href", (d) => d.circleUid.href)
          .attr("startOffset", "50%")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("side", "right")
          .attr("font-size", (d) => scale(d.value))
          .attr("font-family", "sans-serif")
          .text((d) => d.children[0].data.region_name)
      );

      const territories = node
        .selectAll("circle")
        .data((d) =>
          root
            .leaves()
            .filter((elem) => elem.parent.circleUid.id === d.circleUid.id)
        )
        .join("circle")
        .attr("cx", (d) => d.x - d.parent.x)
        .attr("cy", (d) => d.y - d.parent.y)
        .attr("r", (d) => d.r)
        .attr("fill", (d) => (d.data.isPositive ? "none" : "#ee4444"))
        .attr("stroke", (d) =>
          d.data.isPositive ? "rgba(0, 0, 0, .8)" : "none"
        )
        .on("mouseover", (event, d) => {
          // d3.select(event.target).attr("transform", "scale(2)")

          setTooltipState({
            isVisible: true,
            content: (
              <TooltipContent
                region_name={d.data.region_name}
                territory_name={d.data.territory_name}
                value={d.data.valueRubles}
                valuePercent={d.data.valuePercent}
                isPositive={d.data.isPositive}
              />
            ),
            x: event.pageX + 10, // Adjust position as needed
            y: event.pageY + 10,
          });
        })
        .on("mousemove", (event) => {
          setTooltipState((prevState) => ({
            ...prevState,
            x: event.pageX + 10,
            y: event.pageY + 10,
          }));
        })
        .on("mouseout", (event) => {
          setTooltipState((prevState) => ({ ...prevState, isVisible: false }));
        });

      simulation.on("tick", () => {
        {
          node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        }
      });
    }
  }, [measure]);

  return (
    <div ref={chartRef}>
      <svg></svg>
      <Tooltip
        isVisible={tooltipState.isVisible}
        content={tooltipState.content}
        x={tooltipState.x}
        y={tooltipState.y}
      />
    </div>
  );
};

const TooltipContent = (props) => {
  const { territory_name, region_name, value, valuePercent, isPositive } =
    props;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "start",
      }}
    >
      <div>
        <span>
          <b>Регион:</b>{" "}
        </span>
        <span>{region_name}</span>
      </div>
      <div>
        <span>
          <b>Муниципалитет:</b>{" "}
        </span>
        <span>{territory_name}</span>
      </div>
      <div>
        <span>
          <b>Разница:</b>{" "}
        </span>
        <span>
          {(isPositive ? "+" : "-") + value.toLocaleString("ru-RU") + " ₽"} (
          {Math.round(valuePercent * 10) / 10}%)
        </span>
      </div>
    </div>
  );
};

export default BubblesForce;
