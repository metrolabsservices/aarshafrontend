import {
  Avatar,
  Col,
  Descriptions,
  Divider,
  Flex,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import styled from "styled-components";
const Container = styled.div`
  width: 600px;
  border: 1px solid red;
  padding: 10px;
  align-items: center;
  background-color: #ffffffed;
  & .receiptLogo {
    text-align: center;
  }
  & .logoStyle {
    width: 100px;
    height: 100px;
  }
  & .receiptHead {
    color: red;
    margin: 0px;
    font-family: "Monotype Corsiva", cursive;
    font-weight: bold;
  }
  & .receiptCaption {
    font-family: "Monotype Corsiva", cursive;
    margin: 0px !important;
    font-stretch: condensed;
  }
  & .receiptAddresBlock,
  .receiptDeatilsBlock {
    padding: 0px 15px;
  }
  & .receiptAddress {
    text-align: center;
    margin: 0px;
  }
  & .receiptType {
    text-align: center;
    color: red;
    margin: 0px 0px 10px 0px;
  }
  & .receiptEndNote {
    text-align: center;
    font-size: x-small;
  }
  & .zeroDefaultMargin {
    margin: 0% !important;
  }
`;
export const ReceiptGenerater = (props) => {
  const items = [
    {
      key: "1",
      label: "Receipt No",
      children: "1225",
      span: 1,
    },
    {
      key: "2",
      label: "Date",
      children: "5th Feb 2024",
      span: 2,
    },
    {
      key: "3",
      label: "Student Name",
      children: "Nakka Kranthi Kumara Varma",
      span: 3,
    },
    {
      key: "4",
      label: "Class",
      children: "10th",
      span: 1,
    },
    {
      key: "5",
      label: "Duration",
      children: "2:30 Hrs",
      span: 2,
    },
    {
      key: "6",
      label: "Fee Paid (In Words)",
      children: "five thousand eight hundrad and eighty eight rupees",
      span: 3,
    },
    {
      key: "7",
      label: "Balance",
      children: "12345",
      span: 1,
    },
    {
      key: "8",
      label: "Paid Amount",
      children: "12345",
      span: 1,
    },
  ];
  return (
    <Container>
      <Row align="middle" justify="center">
        <Col span={4} className="receiptLogo">
          <Avatar src="/logo.png" alt="logo" className="logoStyle" />
        </Col>
        <Col span={20}>
          <Flex justify="center" align="center" vertical={true}>
            <Typography.Title className="receiptHead">
              AARSHA TUTIONS
            </Typography.Title>
            <Typography.Title level={4} className="receiptCaption">
              Learning is Timeless
            </Typography.Title>
          </Flex>
        </Col>
        <Col span={24} className="receiptAddresBlock">
          <Typography.Paragraph className="receiptAddress">
            1<sup>st</sup>, H No 5-300, Daya, Sriram Nagar Colony, Golden Temple
            Road, Manikonda, Hyderabad - 89
          </Typography.Paragraph>
          <Flex justify="space-between" align="center">
            <Typography.Text>Email - aarshatutions@gmail.com</Typography.Text>
            <Typography.Text>Phone - +91 9392621532</Typography.Text>
          </Flex>
        </Col>
        <Col span={24} className="receiptDeatilsBlock">
          <Typography.Title level={4} className="receiptType" underline>
            TUTION FEE
          </Typography.Title>
          <Descriptions>
            <Row>
              <Col span={12}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={12}>
                <Descriptions.Item label="Date">
                  10<sup>th</sup> Feb 2024
                </Descriptions.Item>
              </Col>
              <Col span={24}>
                <Descriptions.Item label="Student Name">
                  Nakka Kranthi Kumar Varma
                </Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
              <Col span={10}>
                <Descriptions.Item label="Receipt No">123456</Descriptions.Item>
              </Col>
            </Row>
          </Descriptions>
          <Divider className="zeroDefaultMargin" />
          <Typography.Paragraph
            disabled
            style={{ margin: 0, fontSize: "x-small", textAlign: "center" }}
          >
            computer-generated receipt serves as an official payment
            acknowledgement, ensuring accuracy and reliability
          </Typography.Paragraph>
        </Col>
      </Row>
    </Container>
  );
};
