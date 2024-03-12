let a = "Kranthi Kumar Of Soft Ware";
const toCamelCaseString = (x) =>
  x[0].toLowerCase() + x.slice(1).split(" ").join("");

console.log(toCamelCaseString(a));
