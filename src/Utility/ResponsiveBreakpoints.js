export const customBreakPoints = {
  xs: "480px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
};

// {
//   mobileView: i <= 576,
//   tabletView: 577 <= i <= 992,
//   laptopView: 993 <= i <= 1200,
//   desktopView: i > 1201,
// }

export const setBreakPoints = (i) => {
  console.log(i);
  if (i.mobileView || i.tabletView) {
    return "small";
  } else if (i.laptopView) {
    return "middle";
  } else if (i.desktopView) {
    return "large";
  }
};
