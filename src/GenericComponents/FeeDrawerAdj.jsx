import { SmileOutlined } from "@ant-design/icons";
import { Button, Col, Result, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PieChartRep } from "./PieChartRep";
import { Titlecustom } from "./Titlecustom";
import { toDateConverter } from "./Modifiers";

const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  height: 100%;
  & .errorProps {
    /* border: 1px solid red; */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
export const FeeDrawerAdj = (data) => {
  const [props, setProps] = useState({ isError: false });
  const [mydata, setData] = useState(data.data);
  useEffect(() => {
    console.log(data.data);
    setData(data.data);
  }, [data.data]);

  const feechrageColumns = [
    {
      title: "Charge Amount",
      key: "amount",
      dataIndex: "amount",
      render: (i, data) => `₹ ${i}/-`,
    },
    {
      title: "Date",
      key: "dateOfCharged",
      dataIndex: "dateOfCharged",
      render: (i, rec) => toDateConverter({ type: "normal", data: i }),
    },
  ];

  const feedetailsColumn = [
    {
      title: "Paid Amount",
      key: "paidAmount",
      dataIndex: "paidAmount",
      render: (i, data) => `₹ ${i}/-`,
    },
    {
      title: "Date",
      key: "dateOfPaid",
      dataIndex: "dateOfPaid",
      render: (i, rec) => toDateConverter({ type: "normal", data: i }),
    },
  ];

  useEffect(() => {
    // let charge = data.feeCharge.length < 1;
    // console.log(mydata);
    setProps({ ...props, isError: data.data.feeCharge.length < 1 });
  }, [data]);

  return (
    <Container>
      {props.isError ? (
        <Result
          className="errorProps"
          icon={<SmileOutlined />}
          title="No Transactions Were Made"
        />
      ) : (
        <Row gutter={[15, 40]}>
          <Col span={24}>
            <PieChartRep props={{ data: mydata }} />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Table
              title={() => <Titlecustom props={{ data: "Fees Per Month" }} />}
              columns={feechrageColumns}
              dataSource={mydata.feeCharge}
              pagination={false}
              bordered={true}
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Table
              title={() => <Titlecustom props={{ data: "Fee Paid Amounts" }} />}
              columns={feedetailsColumn}
              dataSource={mydata.feeDetails}
              pagination={false}
              bordered={true}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};
