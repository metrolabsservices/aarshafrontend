import { Badge, Col, Flex, Progress, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { Titlecustom } from "./Titlecustom";

export const PieChartRep = ({ props }) => {
  let charge = props.data.feeCharge;
  let payer = props.data.feeDetails;
  const [progressData, setprogressData] = useState({
    success: 0,
    paidAmount: 0,
    chargeAmount: 0,
  });
  useEffect(() => {
    let chargeAmount = props.data.feeCharge
      .map((i) => i.amount)
      .reduce((total, current) => total + current);
    let paidAmount =
      props.data.feeDetails.length < 1
        ? 0
        : props.data.feeDetails
            .map((i) => i.paidAmount)
            .reduce((total, current) => total + current);
    // console.log(chargeAmount, paidAmount);

    setprogressData({
      success: Math.ceil((paidAmount / chargeAmount) * 100),
      paidAmount: paidAmount,
      chargeAmount: chargeAmount,
    });
  }, [props]);

  if (charge.length < 1 && payer.length < 1) {
    return "";
  }
  console.log(progressData);
  return (
    <Flex justify="space-around" align="center">
      <Progress
        success={{ percent: progressData.success, strokeColor: "" }}
        trailColor="#ff0002a3"
        size={250}
        type="dashboard"
        format={() => (
          <Space direction="vertical">
            <Titlecustom props={{ data: `Total Fee` }} />
            <Titlecustom
              props={{ data: `₹ ${progressData.chargeAmount}/-`, level: 3 }}
            />
          </Space>
        )}
      />
      <Space direction="vertical" size="large">
        <Flex align="center" gap="small">
          <Progress
            type="circle"
            status="success"
            percent={100}
            strokeWidth={20}
            size={15}
          />
          <span>Payed Amount : ₹ {progressData.paidAmount} /-</span>
        </Flex>
        <Flex align="center" gap="small">
          <Progress
            type="circle"
            status={
              progressData.chargeAmount - progressData.paidAmount < 0
                ? "normal"
                : "exception"
            }
            percent={100}
            strokeWidth={20}
            size={14}
          />
          <span>
            {progressData.chargeAmount - progressData.paidAmount < 0
              ? `PAYBACK Amount : ₹ ${
                  progressData.paidAmount - progressData.chargeAmount
                } /-`
              : `Pending Amount  : ₹ ${
                  progressData.chargeAmount - progressData.paidAmount
                } /-`}
          </span>
        </Flex>
      </Space>
    </Flex>
  );
};
