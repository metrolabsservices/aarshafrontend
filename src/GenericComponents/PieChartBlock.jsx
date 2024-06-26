import {  Result } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const PieChartBlock = ({ props }) => {
  const [piePrefilledData, setPiePrefilledData] = useState([
    {
      name: "Debit",
      value: 0,
      color: "#e73645",
    },
    {
      name: "Credit",
      value: 0,
      color: "#a1e069ed",
    },
  ]);
  const [error, setError] = useState({ isError: true, errorMessage: "" });

  useEffect(() => {
    if (Array.isArray(props) && props.length > 0) {
      const debitValue = props.reduce((sum, item) => sum + item.debit, 0);
      const creditValue = props.reduce((sum, item) => sum + item.credit, 0);

      if(debitValue === 0 && creditValue === 0 ){
        setError({isError: true, errorMessage: "Pie Chart Not Displayed Due to Nullity of Debit and Credit Amounts"})
      }else {
        setPiePrefilledData([
          {
            name: "Debit",
            value: debitValue,
            color: "#ee5965",
          },
          {
            name: "Credit",
            value: creditValue,
            color: "#a1e069ed",
          },
        ]);
  
        setError({ isError: false, errorMessage: "" });
      }
      
    } else if (typeof props === "undefined") {
      setError({ isError: true, errorMessage: "Incomplete Data Found" });
    } else {
      setError({ isError: true, errorMessage: "Unable to Show Pie Chart" });
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
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={piePrefilledData}
              dataKey="value"
              nameKey="name"
              cx="60%"
              cy="60%"
              outerRadius={80}
              labelLine={false}
              startAngle={90}
              endAngle={-270}
            >
              {piePrefilledData.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}pieCharts`}
                  id={`pieChartData${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};
