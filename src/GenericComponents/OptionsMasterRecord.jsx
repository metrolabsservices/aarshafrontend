export const optionMasterTypes = {
  boardTypes: ["SSC", "CBSE", "IBSE"],
  studentStatusTypes: ["AWAY", "REGULAR", "IN-ACTIVE"],
  gradeTypes: Array.from(
    { length: 10 },
    (_, index) => "Class-" + String(index + 1)
  ),
  filterTypes: [
    "contains",
    "search",
    "none",
    "searchCombined",
    "containsCombined",
  ],
};

export const arrayOfStringConverter = (item) =>
  item.map((i) => ({
    value: i,
    label: i,
  }));
