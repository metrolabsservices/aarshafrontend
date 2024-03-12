import dayjs from "dayjs";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getOrdinalSuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export const toSingleObjectConverter = (x) =>
  x.reduce((acc, obj) => {
    acc[Object.keys(obj)[0]] = obj[Object.keys(obj)[0]];
    return acc;
  });

export const formValidations = {
  Strings: { required: true, message: "${label} is required" },
  Score: {
    pattern: /^(100|[1-9]?\d)$/,
    message: "Enter a valid score between 0 and 100",
  },
  Numbers: {
    pattern: /^[0-9]+$/,
    message: "Only numerical values are allowed",
  },
  PhoneNumbers: {
    pattern: /^[0-9]{10}$/,
    message: "Only numerical values are allowed opto 10",
  },
  Duration: {
    pattern: /^(0?[1-9]|1[0-2]):[0-5][0-9]$/,
    message: "Enter a valid duration hrs,min",
  },
  email: { type: "email", message: "Not a valid email" },
  Password: {
    pattern:
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&.~{}*_=+;:'",</?|>-]).{8,12}$/,
    message:
      " Passwords should contain Numbers, Special Symbols, Uppercase and Lowercase letters ",
  },
};

export const toDateConverter = (x) => {
  if (x.type === "ISO") {
    return new Date(x.data).toISOString();
  } else if (x.type === "normal") {
    let z = [
      getOrdinalSuffix(new Date(x.data).getDate()),
      monthNames[new Date(x.data).getMonth()],
      String(new Date(x.data).getFullYear()),
    ];
    // console.log(z);
    return z.join(" ");
  }
};

export const arrayOfStringConverter = (item) =>
  typeof item === "undefined"
    ? {
        value: "NA",
        label: "NA",
      }
    : item.map((i) => ({
        value: i,
        label: i,
      }));

export const tableFilterListConverter = (item) =>
  typeof item === "undefined"
    ? {
        text: "NA",
        value: "NA",
      }
    : item.map((i) => ({
        text: i,
        value: i,
      }));

export const disablePastDate = (current) => {
  return current < dayjs().subtract(1, "day").endOf("day");
};

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledPastTime = () => ({
  disabledHours: () => range(0, dayjs().toDate().getHours()),
  disabledMinutes: () => range(0, dayjs().toDate().getMinutes()),
  disabledSeconds: () => [0, 60],
});

export const toCaptalizeString = (x) =>
  (x[0].toUpperCase() + x.slice(1))
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace("-", "");

export const toCamelCaseString = (x) =>
  typeof x === "undefined" || x == ""
    ? ""
    : x[0].toLowerCase() + x.slice(1).split(" ").join("");

export const toDescriptionsItemsConvert = (x) => {
  if (x[0].toUpperCase().includes("DATE")) {
    x[1] = toDateConverter({ data: x[1], type: "normal" });
  }
  return {
    label: toCaptalizeString(x[0]),
    children: String(x[1]),
  };
};

export const toSpaceSeperateJoinConverter = (x) => x.join(", ");

export const refineData = (props) => {
  let x = { descriptionData: {}, extracted: {}, filtersList: {} };
  x.descriptionData = Object.entries(props)
    .filter((i) => i[0] !== "isDeleted" && i[0] !== "name")
    .map((i) => {
      if (i[0] === "feeDetails") {
        x.extracted["feeDetails"] = i[1]
          .map((j) =>
            Object.entries(j)
              .filter((k) => k[0] !== "studentId")
              .map((it) => {
                if (it[0] === "subjectsTaken") {
                  return { [it[0]]: toSpaceSeperateJoinConverter(it[1]) };
                } else if (it[0] == "dateOfPaid") {
                  return {
                    [it[0]]: toDateConverter({ type: "normal", data: it[1] }),
                  };
                } else {
                  return it[0] === "id"
                    ? { [it[0]]: String(it[1]) }
                    : { [it[0]]: String(it[1]) + "/-" };
                }
              })
          )
          .map((item) => toSingleObjectConverter(item));
      } else if (i[0] === "subjectsTaken") {
        return toDescriptionsItemsConvert([
          i[0],
          toSpaceSeperateJoinConverter(i[1]),
        ]);
      } else if (i[0] === "subjectStatistics") {
        let idx = 0;
        let filterList = { subjectList: [], classList: [] };
        let sa = i[1]
          .map((i) =>
            Object.keys(i)
              .filter((j) => j !== "id" && j !== "studentId")
              .map((k) => {
                if (!filterList.subjectList.includes(i["subjectName"])) {
                  filterList.subjectList.push(i["subjectName"]);
                }
                if (k === "subjectScores") {
                  return i[k].map((item) => {
                    idx += 1;
                    let refineItem = item.split("^^^");
                    if (!filterList.classList.includes(refineItem[3])) {
                      filterList.classList.push(refineItem[3]);
                    }
                    return {
                      id: idx,
                      scoredMarks: refineItem[0],
                      maxMarks: refineItem[1],
                      dateOfTest: toDateConverter({
                        type: "normal",
                        data: refineItem[2],
                      }),
                      subjectName: i["subjectName"],
                      classNo: refineItem[3],
                    };
                  });
                }
              })
          )
          .flat(Infinity)
          .filter((i) => typeof i !== "undefined");
        x.extracted["subjectStatistics"] = sa;
        x.filtersList = filterList;
      } else {
        return i[0] === "dueAmount"
          ? toDescriptionsItemsConvert([i[0], i[1] + "/-"])
          : toDescriptionsItemsConvert(i);
      }
    });
  x.descriptionData = x.descriptionData.filter((i) => typeof i !== "undefined");
  return x;
};

export const toObjectToPara = (prop) => {
  let x = "";
  return prop.map((i) => `${toCaptalizeString(i[0])} - ${i[1]}`).join(", ");
};
