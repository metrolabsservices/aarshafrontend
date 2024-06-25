import { Result, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const PieChartBlock = ({ props }) => {
  // const [rawChartData, setRawChartData] = useState([]);

  const [piePrefilledData, setpiePrefilledData] = useState([
    {
      name: "Debit",
      value: 0,
      color: "#ee5965",
    },
    {
      name: "Credit",
      value: 0,
      color: "#a1e069ed",
    },
  ]);
  const [error, setError] = useState({ isError: true, errorMessage: "" });
  useEffect(() => {
    // console.log(props, "Pie Data ");
    if (typeof props !== "undefined") {
      // setRawChartData(props);
      console.log("right ------", props);
      setpiePrefilledData([
        {
          ...piePrefilledData[0],
          value: props.reduce((sum, item) => sum + item.debit, 0),
        },
        {
          ...piePrefilledData[1],
          value: props.reduce((sum, item) => sum + item.credit, 0),
        },
      ]);
      setError({ isError: false, errorMessage: "" });
    } else if (typeof props === "undefined") {
      console.log("bug ----");
      setError({ isError: true, errorMessage: "In Complete Data Found" });
    } else {
      console.log("failed -------");
      setError({ isError: true, errorMessage: "Unable to show pie chart" });
    }
  }, [props]);

  return (
    <Container>
      {error.isError ? (
        <Result
          title={error.errorMessage}
          style={{ padding: "10px 20px", margin: 0, height: "100%" }}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};
