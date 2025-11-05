import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { rewind, compactNumber } from "../utils";

const Map = (props) => {
  const { data, highlighted } = props;
  const { width, height } = props;

  const containerRef = useRef();

  useEffect(() => {
    const dataRewinded = rewind(data);

    const plot = Plot.plot({
      width: width,
      height: height,
      marginTop: 32,
      projection: { type: "mercator", domain: dataRewinded },
      color: {
        legend: true,
        range: ["white", "#ee4444"],
        label: "Δ расходов 2023 — 2024, ₽",
        tickFormat: (d) => compactNumber(-d).toLocaleString("ru-RU"),
      },
      marks: [
        Plot.geo(dataRewinded, {
          fill: (d) => {
            const e = highlighted.find(
              (elem) => elem.territory_id === +d.properties.territory_id
            );
            return e ? -e.diff : 0;
          },
          stroke: "black",
          strokeWidth: 0.5,
          sort: { channel: "-fill" },
        }),
        Plot.text(
          dataRewinded,
          Plot.centroid({
            text: (d) => {
              const territory = highlighted.find(
                (elem) => elem.territory_id === +d.properties.territory_id
              );
              return territory ? territory.territory_name : "";
            },
            fill: "black",
            stroke: "white",
            textAnchor: "start",
            dx: 6,
          })
        ),
        Plot.text([highlighted[0].region_name], {
          frameAnchor: "top",
          dy: -24,
          fontSize: 16,
          text: (d) => d,
        }),
      ],
      style: {
        overflow: "visible",
      },
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, []);

  return <div ref={containerRef} />;
};

export default Map;
