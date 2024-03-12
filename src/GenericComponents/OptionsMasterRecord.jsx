export const optionMasterTypes = {
  boardTypes: ["SSC", "CBSE", "IBSE"],
  studentStatusTypes: ["AWAY", "REGULAR", "IN-ACTIVE"],
  gradeTypes: Array.from(
    { length: 10 },
    (_, index) => "Class-" + String(index + 1)
  ),
  subjects: [
    "Telugu",
    "Hindi",
    "English",
    "Maths",
    "Physics",
    "Chemistry",
    "Biology",
    "Social",
  ],
  filterTypes: [
    "contains",
    "search",
    "none",
    "searchCombined",
    "containsCombined",
  ],
};
