import {
  Card,
  Flex,
  Progress,
  Result,
  Space,
  Statistic,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  & .ant-card-body {
    padding: 10px !important;
  }
  & .ant-card-head {
    padding: 10px !important;
  }
  & .cardTitleStyle {
    border-left: 10px solid #4fc748;
    padding-left: 10px;
  }
  & .cardTitleBorderColor {
    border-color: red;
  }

  & .contentStyles {
    margin: "5px 0px";
    font-size: small;
    /* font-weight: bold; */
  }
`;

export const TransactionStatsChart = ({ props }) => {
  const [totalAmount, settotalAmount] = useState({ credit: 0, debit: 0 });
  const [rawChartData, setRawChartData] = useState([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    // console.log(props, "Stats", props?.length > 0);
    if (props?.length > 0) {
      const totals = props.reduce(
        (acc, curr) => {
          acc.credit += curr.credit;
          acc.debit += curr.debit;
          return acc;
        },
        { credit: 0, debit: 0 }
      );
      settotalAmount(totals);
      setRawChartData(props);
      setError(false);
    } else {
      setError(true);
    }
  }, [props]);

  //   console.log(props);
  return (
    <Container>
      {error ? (
        <Result
          title="In Complete Data Found"
          style={{ padding: "10px 20px", margin: 0, height: "100%" }}
        />
      ) : (
        <Flex justify="space-evenly" align="center">
          <Card
            title={
              <Statistic
                title={
                  <Typography.Text className="cardTitleStyle">
                    Credit
                  </Typography.Text>
                }
                value={totalAmount.credit}
                valueStyle={{
                  fontWeight: "normal",
                  fontSize: "large",
                  textAlign: "end",
                }}
                precision={2}
                prefix="₹ "
                suffix="/-"
              />
            }
            style={{ width: 300 }}
          >
            {rawChartData.map((i, idx) => (
              <Flex justify="space-between">
                <Typography.Text
                  className="contentStyles"
                  type={i.credit < 1 ? "secondary" : ""}
                >
                  {i.category}
                </Typography.Text>

                <Statistic
                  className="contentStyles"
                  value={i.credit}
                  valueStyle={{
                    fontWeight: "normal",
                    fontSize: "small",
                    color: i.credit < 1 ? "#00000073" : "green",
                  }}
                  prefix={i.credit < 1 ? "" : "₹ "}
                  suffix={i.credit < 1 ? "" : "/-"}
                />
              </Flex>
            ))}
          </Card>
          <Card
            title={
              <Statistic
                title={
                  <Typography.Text className="cardTitleStyle cardTitleBorderColor">
                    Debit
                  </Typography.Text>
                }
                value={totalAmount.debit}
                valueStyle={{
                  fontWeight: "normal",
                  fontSize: "large",
                  textAlign: "end",
                }}
                precision={2}
                prefix="₹ "
                suffix="/-"
              />
            }
            style={{ width: 300 }}
          >
            {rawChartData.map((i, idx) => (
              <Flex justify="space-between">
                <Typography.Text
                  className="contentStyles"
                  type={i.debit < 1 ? "secondary" : ""}
                >
                  {i.category}
                </Typography.Text>

                <Statistic
                  className="contentStyles"
                  value={i.debit}
                  valueStyle={{
                    fontWeight: "normal",
                    fontSize: "small",
                    color: i.debit < 1 ? "#00000073" : "red",
                  }}
                  prefix={i.debit < 1 ? "" : "₹ "}
                  suffix={i.debit < 1 ? "" : "/-"}
                />
              </Flex>
            ))}
          </Card>
        </Flex>
      )}
    </Container>
  );
};
