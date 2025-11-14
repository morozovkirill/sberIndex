import { Suspense, lazy } from "react";
import "./App.css";

import { dataConsumptionNegativeTerritorieslected } from "./data/data";

const ConsumptionByCategoriesTerritoriesCount = lazy(() =>
  import("./components/consumptionByCategoriesTerritoriesCount")
);
const ConsumptionByCategories = lazy(() =>
  import("./components/consumptionByCategories")
);
const SalaryByTerritories = lazy(() =>
  import("./components/salaryByTerritories")
);
const ConsumptionVsSalary = lazy(() =>
  import("./components/consumptionVsSalary")
);
const ConsumptionByYearsByCategoriesNegativeTotal = lazy(() =>
  import("./components/consumptionByYearsByCategoriesNegativeTotal")
);
const Map = lazy(() => import("./components/map"));
const ConsumptionByMonth = lazy(() =>
  import("./components/consumptionByMonth")
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Маркетплейсы стали лидером роста расходов в&nbsp;2024&nbsp;году
      </header>

      <div className="caption">
        <div className="paragraph" style={{ textAlign: "center" }}>
          Расходы в&nbsp;категории &laquo;Маркетплейсы&raquo; выросли более чем
          на&nbsp;40&nbsp;млн. &#8381; год к&nbsp;году во&nbsp;всех
          муниципальных образованиях
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "3em",
          marginTop: "1em",
        }}
      >
        <div className="chartContainer" style={{ minHeight: 100 }}>
          <Suspense fallback={<Loading />}>
            <ConsumptionByCategories width={1000} height={1600} />
          </Suspense>
        </div>
        <div className="paragraph">
          Абсолютно во&nbsp;всех рассматриваемых муниципальных
          образованиях&nbsp;(МО) расходы в&nbsp;категории
          &laquo;Маркетплейсы&raquo; выросли. Рост составил более 40&nbsp;млн
          &#8381;. Сумма получилась сложением средних месячных расходов
          в&nbsp;2023 и&nbsp;2024 по&nbsp;данным Сбериндекса.
        </div>

        <div className="paragraph">
          В&nbsp;&laquo;Продовольствии&raquo; увеличение тоже существенное.
          Но&nbsp;оно как-бы столкнулось с&nbsp;границей в&nbsp;районе
          20&nbsp;000 &#8381;. Видимо, существует ограничитель, который
          не&nbsp;позволяет тратить больше определенной суммы именно здесь.
        </div>
        <div className="paragraph">
          Но, несмотря на&nbsp;общий тренд увеличения расходов,
          в&nbsp;&laquo;Общественном питании&raquo;, &laquo;Здоровье&raquo;,
          &laquo;Транспорте&raquo; и&nbsp;&laquo;Других категориях&raquo;
          во&nbsp;многих МО&nbsp;расходы снизились.
        </div>
        <Suspense fallback={<Loading />}>
          <ConsumptionByCategoriesTerritoriesCount width={1000} height={200} />
        </Suspense>
        <div className="paragraph">
          В {dataConsumptionNegativeTerritorieslected.length} муниципальных
          образованиях расходы сократились в&nbsp;четырех и&nbsp;более
          категориях.
        </div>
        <div className="chartContainer" style={{ minHeight: 100 }}>
          <Suspense fallback={<Loading />}>
            <ConsumptionByYearsByCategoriesNegativeTotal
              width={1000}
              height={1600}
            />
          </Suspense>
        </div>
        <div className="paragraph">
          Можно предположить, что сокращение расходов связано с&nbsp;уменьшением
          заработка. И&nbsp;действительно, в&nbsp;15&nbsp;МО&nbsp;размер средней
          заработной платы в&nbsp;2024 году сократился.
        </div>
        <div style={{ minHeight: 100 }}>
          <Suspense className="chartContainer" fallback={<Loading />}>
            <SalaryByTerritories width={1000} height={600} />
          </Suspense>
        </div>
        <div className="paragraph">
          Но, если сравнить эти данные, то&nbsp;видно, что пересечения точечные.
        </div>
        <div style={{ minHeight: 100 }}>
          <Suspense className="chartContainer" fallback={<Loading />}>
            <ConsumptionVsSalary width={1000} height={600} />
          </Suspense>
        </div>

        <div className="paragraph">
          Сокращение расходов в&nbsp;&laquo;Общественном питании&raquo; может
          быть связано со&nbsp;сменой поведения и&nbsp;увеличением расходов
          в&nbsp;&laquo;Продовольствии&raquo;. Но&nbsp;на&nbsp;данных это
          отследить сложно.
        </div>

        <div className="paragraph">
          Динамика разницы расходов по&nbsp;месяцам отличается в&nbsp;разных
          категориях. Но&nbsp;есть и&nbsp;общие моменты. Первые три месяца
          в&nbsp;&laquo;Общественном питании&raquo;, &laquo;Здоровье&raquo;,
          &laquo;Транспорте&raquo; и&nbsp;&laquo;Других категориях&raquo;
          показывают существенное снижение расходов в&nbsp;значительной части
          МО. Далее динамика отличается. В&nbsp;категории &laquo;Здоровье&raquo;
          заметно снижение расходов в&nbsp;августе и&nbsp;в&nbsp;конце года.
          В&nbsp;&laquo;Транспорте&raquo; нет ярко-выраженной динамики.
          В&nbsp;&laquo;Других категориях&raquo;&nbsp;&mdash; плавное увеличение
          расходов к&nbsp;концу года.
        </div>

        <div className="chartContainer" style={{ minHeight: 100 }}>
          <Suspense fallback={<Loading />}>
            <ConsumptionByMonth width={1000} height={600} />
          </Suspense>
        </div>

        <div className="paragraph">
          В&nbsp;категории &laquo;Продовольствие&raquo; заметно значительное
          увеличение расходов с&nbsp;января по&nbsp;май и&nbsp;затем
          симметричное снижение к&nbsp;сентябрю. И&nbsp;до&nbsp;конца года
          значения колеблются в&nbsp;одном диапазоне.
          В&nbsp;&laquo;Маркетплейсах&raquo; динамика похожа, но&nbsp;она более
          плавная. И&nbsp;в&nbsp;конце года&nbsp;&mdash; значительное увеличние,
          связанное скорее всего с&nbsp;расходами на&nbsp;Новый год.
        </div>

        <div className="paragraph">
          Москва, Санкт-Петербург и&nbsp;Московская область в&nbsp;лидерах
          по&nbsp;увеличению расходов во&nbsp;всех категориях. Поэтому далее
          рассматриваем преимущественно другие регионы.
        </div>

        <div className="paragraph">
          Географически заметно точечное значительное увеличение расходов
          в&nbsp;муниципалитах Вологодской, Ивановской, Саратовской, Курганской
          областей, Красноярского, Алтайского краев, Руспублики Тыва. Сокращения
          есть в&nbsp;МО&nbsp;Омскй, Иркутской, Амурской, Сахалинской,
          Свердловской, Курсганской и&nbsp;Самарской областях.
        </div>

        <Suspense fallback={<Loading />}>
          <Map width={1000} height={600} />
        </Suspense>

        <div className="paragraph">
          &laquo;Продовольствие&raquo;&nbsp;&mdash; вторая по&nbsp;количеству
          и&nbsp;сумме увеличения расходов категория. В&nbsp;лидерах все
          те&nbsp;же Омская, Иркутская, а&nbsp;также Кировская, Костромская
          области, Руспублика Тыва. Сокращения не&nbsp;многочисленные:
          Сахалинская, Амурская области, руспублики Саха, Башкортостан.
        </div>

        <div className="paragraph">
          &laquo;Здоровье&raquo; и&nbsp;&laquo;Транспорт&raquo; показывают
          схожую динамику. Основной тренд на&nbsp;рост расходов, но&nbsp;есть
          значительное количество МО, в&nbsp;которых тратить стали меньше.
        </div>

        <div className="paragraph">
          Расходы на&nbsp;здоровье сильнее выросли в&nbsp;крупных мегаполисах
          с&nbsp;высокой плотностью населения: Москва, Московская область,
          Санкт-Петербург. А&nbsp;также в&nbsp;муниципалитетах республик Саха,
          Тыва, Псковской, Ульяновской, Ивановской областей. Сокращение расходов
          заметно в&nbsp;МО&nbsp;Сахалинской, Амурской, Иркутской,
          Новосибирской, Тюменской, Свердловской, Астраханской, Тверской
          областей.
        </div>

        <div className="paragraph">
          Динамика расходов на&nbsp;траспорт схожа с&nbsp;категорией
          &laquo;Здоровье&raquo;. Но&nbsp;сильнее заметно увеличение
          в&nbsp;муниципалитетах Иркутской, Магаданской областей, республики
          Тыва.
        </div>

        <div className="paragraph">
          &laquo;Маркетплейсы&raquo; выросли значительно больше других. Даже
          в&nbsp;тех муниципалитетах, где наблюдается снижение заработка,
          расходы в&nbsp;этой категории выросли на&nbsp;40%–50%.
          И&nbsp;в&nbsp;целом рост по&nbsp;стране достаточно равномерный.
          Выделяются МО&nbsp;Красноярского, Хабаровского краев, республики Саха,
          Омской, Кировской, Архангельской областей.
        </div>

        <div className="paragraph">
          <ol>
            В исследовании использованы данные:
            <li>
              <a href="https://sberindex.ru/ru/research/data-sense-opisanie-nabora-dannikh-khakatona-sberindeksa-po-munitsipalnim-dannim">
                Потребительские безналичные расходы на&nbsp;уровне муниципальных
                образований по&nbsp;категориям трат.
              </a>{" "}
              СберИндекс. Скачаны 01.11.2025.
            </li>
            <li>
              <a href="https://www.sberbank.com/common/img/uploaded/files/konkurs_sberindex/rosstat.zip">
                Данные Росстата по заработным платам.
              </a>
            </li>
            <li>
              <a href="https://sberindex.ru/ru/news/dataset-borders-and-changes-of-municipalities">
                Справочник МО.
              </a>
            </li>
          </ol>
        </div>
        <div className="paragraph">
          <a href="https://t.me/spacernamer">Контакт для обратной связи</a>
        </div>
      </div>
    </div>
  );
}

const Loading = (props) => {
  return <div className="loading">загрузка...</div>;
};

export default App;
