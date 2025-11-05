import { dataConsumptionByYears } from "./dataConsumptionByYears";
import { dataSalaryByYears } from "./dataSalariesByYears";

export const dataConsumptionByYearsByCategories = dataConsumptionByYears
  .map((elem) =>
    elem.categories.map((item) => ({
      territory_id: elem.territory_id,
      territory_name: elem.territory_name,
      region_name: elem.region_name,
      diff: item.diff,
      diffPercent: item.diffPercent,
      category: item.category,
    }))
  )
  .flat();

export const dataTerritories = [
  ...new Set(
    dataConsumptionByYearsByCategories.map((elem) => elem.territory_id)
  ),
];

export const dataTerritoriesNames = dataTerritories.map((elem) => {
  const name = dataConsumptionByYearsByCategories.find(
    (item) => item.territory_id === elem
  ).territory_name;
  return {
    id: elem,
    name: name,
  };
});

export const dataTerritoriesConsumptionNegative = dataTerritories.filter(
  (elem) => {
    const arr = dataConsumptionByYearsByCategories.filter(
      (item) => item.territory_id === elem
    );
    return arr.some((item) => item.diff < 0);
  }
);

export const dataTerritoriesConsumptionNegativeTotal = dataTerritories.filter(
  (elem) =>
    dataConsumptionByYears.find(
      (item) => item.territory_id === elem && item.diff < 0
    )
);

export const dataUnitedConsumptionSalary = dataConsumptionByYears
  .map((elem) => {
    const s = dataSalaryByYears.find(
      (item) => item.territory_id === elem.territory_id
    );
    if (s) {
      const obj = {
        territory_id: elem.territory_id,
        territory_name: elem.territory_name,
        region_id: elem.region_id,
        region_name: elem.region_name,
        consumption: {
          2023: elem.total["2023"] / 12,
          2024: elem.total["2024"] / 12,
        },
        consDiff: elem.diff / 12,
        consDiffPercent: elem.diffPercent,
        salary: {
          2023: s.total["2023"],
          2024: s.total["2024"],
        },
        salaryDiff: s.diff,
        salaryDiffPercent: s.diffPercent,
        totalDiff: {
          2023: s.total["2023"] - elem.total["2023"] / 12,
          2024: s.total["2024"] - elem.total["2024"] / 12,
        },
      };
      return obj;
    } else {
      return null;
    }
  })
  .filter((elem) => elem !== null);

export const dataConsumptionByYearsByCategoriesNegativeTotal =
  dataConsumptionByYearsByCategories.filter((elem) =>
    dataTerritoriesConsumptionNegativeTotal.some(
      (item) => item === elem.territory_id
    )
  );
