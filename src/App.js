import { useState, useEffect, Suspense, lazy } from "react";
import {
  dataTerritoriesConsumptionNegativeTotal,
  dataConsumptionByYearsByCategories,
  dataTerritoriesNames,
} from "./data/data";
import { dataConsumptionByYears } from "./data/dataConsumptionByYears";
import { sakhalin } from "./data/geoSakhalin";
import { magadan } from "./data/geoMagadan";
import { sverdlovsk } from "./data/geoSverdlovsk";
import { orel } from "./data/geoOrel";
// import { yakutsk } from "./data/geoYakutsk";
import { piter } from "./data/geoPiter";
import "./App.css";
import BubblesForce from "./components/bubblesForce";
import ConsumptionByCategoriesTerritoriesCount from "./components/consumptionByCategoriesTerritoriesCount";
import ConsumptionByCategoriesRubles from "./components/consumptionByCategoriesRubles";
import ConsumptionByCategories from "./components/consumptionByCategories";
import SalaryConsumptionByTerritories from "./components/salaryConsumptionByTerritories";
import SalaryByTerritories from "./components/salaryByTerritories";
import ConsumptionVsSalary from "./components/consumptionVsSalary";
import ConsumptionByYearsByCategoriesNegativeTotal from "./components/consumptionByYearsByCategoriesNegativeTotal";
// import Map from "./components/map";
import { compactNumber } from "./utils";

const Map = lazy(() => import("./components/map"));

function App() {
  const [IsRubles, setIsRubles] = useState(true);
  const [dataYakutsk, setDataYakutsk] = useState(null);
  const [loadingYakutsk, setLoadingYakutsk] = useState(true);
  const [errorYakuts, setErrorYakutsk] = useState(null);

  useEffect(() => {
    fetch("geoYakutsk.json") // Path relative to your public folder
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setDataYakutsk(json);
        setLoadingYakutsk(false);
      })
      .catch((error) => {
        setErrorYakutsk(error);
        setLoadingYakutsk(false);
      });
  }, []);

  console.log({ errorYakuts });

  return (
    <div className="App">
      <header className="App-header">
        В&nbsp;{dataTerritoriesConsumptionNegativeTotal.length}
        &nbsp;муниципалитетах в&nbsp;2024 году расходы населения сократились
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "2em",
          marginTop: "2em",
        }}
      >
        <div>
          Несмотря на&nbsp;общий тренд увеличения расходов, в&nbsp;
          {dataTerritoriesConsumptionNegativeTotal.length} муниципальных
          образованиях&nbsp;(МО) люди в&nbsp;2024 году тратили меньше, чем
          в&nbsp;2023
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "end",
              zIndex: 1,
            }}
          >
            <button
              className={"left" + (IsRubles ? " active" : "")}
              onClick={() => setIsRubles(true)}
            >
              В рублях
            </button>
            <button
              className={"right" + (!IsRubles ? " active" : "")}
              onClick={() => setIsRubles(false)}
            >
              В процентах
            </button>
          </div>

          <div
            className="legend"
            style={{
              display: "flex",
              width: "100%",
              alignItems: "end",
              justifyContent: "center",
              flexDirection: "column",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "end",
                columnGap: 8,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#ee4444",
                  borderRadius: 16,
                }}
              ></div>
              <div>здесь и&nbsp;далее&nbsp;&mdash; сокращение расходов</div>
            </div>
            <div>
              Размер круга&nbsp;&mdash; разница между 2024 и&nbsp;2023 годами (
              {(() => {
                const arr = dataConsumptionByYears.map((elem) =>
                  IsRubles
                    ? Math.abs(elem.diff)
                    : Math.abs(Math.round(elem.diffPercent * 10) / 10)
                );
                return (
                  Math.min(...arr).toLocaleString("ru-RU") +
                  " — " +
                  compactNumber(Math.max(...arr)) +
                  (IsRubles ? " ₽" : "%")
                );
              })()}
              )
            </div>
          </div>
        </div>

        <div style={{ marginTop: "-160px", height: window.innerWidth * 0.75 }}>
          <BubblesForce
            measure={IsRubles}
            width={window.innerWidth * 0.75}
            height={window.innerWidth * 0.75}
          />
        </div>

        <div className="paragraph" style={{ marginTop: "-140px" }}>
          Благодаря данным СберИндекс, можно сравнить распределение изменений
          в&nbsp;тратах по&nbsp;категориям.
        </div>

        <div className="paragraph">
          Расходы на&nbsp;транспорт сократились в&nbsp;самом большом количестве
          муниципалитетов.
        </div>

        <div style={{ height: 160 }}>
          <ConsumptionByCategoriesTerritoriesCount width={1000} height={160} />
        </div>

        <div className="paragraph">
          Но, в&nbsp;абсолютном выражении, &laquo;лидируют&raquo; расходы
          на&nbsp;продовольствие. Они сократились год к&nbsp;году на&nbsp;
          {compactNumber(
            Math.abs(
              dataConsumptionByYearsByCategories
                .filter(
                  (elem) => elem.category === "Продовольствие" && elem.diff < 0
                )
                .reduce((acc, curr) => acc + curr.diff, 0)
            )
          )}
          &nbsp;₽&nbsp;в&nbsp;
          {dataConsumptionByYearsByCategories
            .filter(
              (elem) => elem.category === "Продовольствие" && elem.diff < 0
            )
            .length.toLocaleString("ru-RU")}
          &nbsp;МО.
        </div>

        <div style={{ height: 160 }}>
          <ConsumptionByCategoriesRubles width={1000} height={160} />
        </div>

        <div className="paragraph">
          Чтобы понять общую картину, сравним расходы по&nbsp;категориям
          по&nbsp;всем МО.
        </div>

        <div style={{ height: 1200 }}>
          <ConsumptionByCategories width={1000} height={1200} />
        </div>

        <div className="paragraph">
          Заметен схожий характер поведения в&nbsp;&laquo;Общественном
          питании&raquo;, &laquo;Здоровье&raquo;
          и&nbsp;&laquo;Транспорте&raquo;. В&nbsp;&laquo;Маркетплейсах&raquo;
          есть точечные сокращения расходов по&nbsp;МО, а&nbsp;увеличение похоже
          на&nbsp;нормальное распределение.
        </div>

        <div className="paragraph">
          В&nbsp;&laquo;Продовольствии&raquo; большая динамика и&nbsp;объем
          сокращения расходов, а&nbsp;увеличение &laquo;уперлось&raquo;
          в&nbsp;границу в&nbsp;районе 22&nbsp;000 &#8381;.
        </div>

        <div className="paragraph">
          Можно предположить, что сокращение расходов связано с&nbsp;уменьшением
          заработка. И&nbsp;действительно, в&nbsp;15&nbsp;МО&nbsp;размер средней
          заработной платы в&nbsp;2024 году сократился.
        </div>

        <div style={{ height: 600 }}>
          <SalaryConsumptionByTerritories width={1000} height={600} />
        </div>

        <div className="paragraph">
          Но&nbsp;расходы сократились в&nbsp;гораздо большем количестве&nbsp;МО.
        </div>

        <div style={{ height: 1200 }}>
          <SalaryByTerritories width={1000} height={1200} />
        </div>

        <div className="paragraph">
          И, если сравнить эти данные, то&nbsp;видно, что пересечений
          по&nbsp;МО&nbsp;нет. Единственное исключение&nbsp;&mdash; Шумерлинский
          муниципалитет (Чувашская республика).
        </div>

        <div style={{ height: 600 }}>
          <ConsumptionVsSalary width={1000} height={600} />
        </div>

        <div className="paragraph">
          Посмотрим детальнее на&nbsp;разницу в&nbsp;расходах среди тех&nbsp;МО,
          в&nbsp;которых они сократились. В&nbsp;большинстве сокращение заметно
          по&nbsp;всем категориям, кроме &laquo;Маркетплейсов&raquo;.
          Но&nbsp;основной вес вносит &laquo;Продовольствие&raquo;.
        </div>

        <div style={{ height: 1200 }}>
          <ConsumptionByYearsByCategoriesNegativeTotal
            width={1000}
            height={1200}
          />
        </div>

        <div className="paragraph">
          К&nbsp;сожалению, понять точные причины снижения расходов
          в&nbsp;этих&nbsp;МО&nbsp;не&nbsp;получилось. Их&nbsp;география
          и&nbsp;экономика сильно разнятся.
        </div>

        <div style={{ height: (window.innerWidth - 200 - 80 * 3) / 3 + 60 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Map
              data={sakhalin}
              highlighted={[1964, 1956, 1959, 1969].map((elem) =>
                dataConsumptionByYears.find(
                  (item) => item.territory_id === elem
                )
              )}
              territories={dataTerritoriesNames}
              width={(window.innerWidth - 200 - 80 * 3) / 3}
              height={(window.innerWidth - 200 - 80 * 3) / 3}
            />
          </Suspense>
        </div>

        <div className="paragraph">
          Например, Северо-Курильский округ состоит из&nbsp;одного города
          с&nbsp;населением примерно 3,5 тыс. человек и&nbsp;в&nbsp;составе цен
          на&nbsp;продовольствие большая составляющая транспортных расходов.
          О&nbsp;каких-либо субсидиях на&nbsp;продукты питания также неизвестно.
        </div>

        <div style={{ height: (window.innerWidth - 200 - 80 * 3) / 3 + 60 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Map
              data={magadan}
              highlighted={[1432, 1436, 1437, 1434].map((elem) =>
                dataConsumptionByYears.find(
                  (item) => item.territory_id === elem
                )
              )}
              territories={dataTerritoriesNames}
              width={(window.innerWidth - 200 - 80 * 3) / 3}
              height={(window.innerWidth - 200 - 80 * 3) / 3}
            />
          </Suspense>
        </div>

        <div className="paragraph">
          Сразу несколько МО&nbsp;Магаданской области демонстрируют существенное
          сокращение расходов: Омсукчанский, Тенькинский, Хасынский
          и&nbsp;Среднеканский.
        </div>

        <div
          style={{
            display: "flex",
            height: (window.innerWidth - 200 - 80 * 3) / 3 + 60,
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Map
              data={orel}
              highlighted={[1713, 1720, 1721, 1723].map((elem) =>
                dataConsumptionByYears.find(
                  (item) => item.territory_id === elem
                )
              )}
              width={(window.innerWidth - 200 - 80 * 3) / 3}
              height={(window.innerWidth - 200 - 80 * 3) / 3}
            />
          </Suspense>
          <Suspense>
            <Map
              data={sverdlovsk}
              highlighted={[2016, 2020, 2026].map((elem) =>
                dataConsumptionByYears.find(
                  (item) => item.territory_id === elem
                )
              )}
              width={(window.innerWidth - 200 - 80 * 3) / 3}
              height={(window.innerWidth - 200 - 80 * 3) / 3}
            />
          </Suspense>
          {dataYakutsk ? (
            <Suspense fallback={<div>Loading...</div>}>
              <Map
                data={dataYakutsk}
                highlighted={[315, 322, 313, 344, 328].map((elem) =>
                  dataConsumptionByYears.find(
                    (item) => item.territory_id === elem
                  )
                )}
                width={(window.innerWidth - 200 - 80 * 3) / 3}
                height={(window.innerWidth - 200 - 80 * 3) / 3}
              />
            </Suspense>
          ) : null}
        </div>

        <div className="paragraph">
          Так&nbsp;же по&nbsp;несколько муниципалитетов есть в&nbsp;Орловской,
          Свердловской областях и&nbsp;Республике Саха.
        </div>

        <div style={{ height: (window.innerWidth - 200 - 80 * 3) / 3 + 60 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Map
              data={piter}
              highlighted={[2394].map((elem) =>
                dataConsumptionByYears.find(
                  (item) => item.territory_id === elem
                )
              )}
              width={(window.innerWidth - 200 - 80 * 3) / 3}
              height={(window.innerWidth - 200 - 80 * 3) / 3}
            />
          </Suspense>
        </div>

        <div className="paragraph">
          Остальные&nbsp;&mdash; единичные случаи в&nbsp;своих регионах,
          на&nbsp;фоне которых заметно выделяется Петро-Славянка
          в&nbsp;Санкт-Петербурге.
        </div>
        <div className="paragraph">
          На&nbsp;основе имеющихся данных, сделать выводы о&nbsp;причинах
          сокращения расходов в&nbsp;2024 по&nbsp;сравнению с&nbsp;2023
          не&nbsp;получается. Нужны дополнительные исследования на&nbsp;уровне
          этих муниципалитетов.
        </div>
      </div>
    </div>
  );
}

export default App;
