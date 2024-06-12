import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import {
  arrayOfStringConverter,
  disablePastDate,
  disabledPastTime,
  formValidations,
  toCaptalizeString,
} from "../../GenericComponents/Modifiers";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleTwoTone,
  PlusCircleTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { useGuard } from "../../dbHub/GuardContext";
import { StepperInput } from "../../GenericComponents/StepperInput";

const Container = styled.div`
  /* background-color: yellow; */
  & .studentFormStyle {
    padding: 10px;
    max-height: 380px;
    overflow-y: auto;
  }
`;

export const Studentforms = () => {
  const [form] = Form.useForm();
  const { dbInfo } = useGuard();
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [selectorsList, setselectorsList] = useState({
    boardTypes: [],
    gradeTypes: [],
    id: 0,
    paymentTypes: [],
    studentStatusTypes: [],
    subjectTypes: [],
    transactionTypes: [],
    transactionsCategoryTypes: [],
  });
  const [timing, setTiming] = useState("02:00");
  const nav = useNavigate();

  const onFinish = async (e) => {
    let data = {
      ...e,
      pastScore: parseInt(e.pastScore),
      feeCharge: {
        create: {
          amount: parseInt(e.feeCharge),
          dateOfCharged: new Date().toISOString(),
        },
      },
      joiningDate: new Date().toISOString(),
      dueAmount: e.feeCharge,
      isDeleted: false,
    };
    console.log("submit action -- ", e);
    console.log("Change action -- ", data);
    await axiosInstance
      .post(API.STUDENT_BY_ID + "create", data)
      .then((res) => {
        console.log(res.data);
        let apiData = res.data.data;
        Modal.success({
          title: `${res.data.response}`,
          content: ` ${toCaptalizeString(apiData.name)} is registered with ${
            apiData.id
          } ID`,
          centered: true,
          keyboard: false,
          footer: [
            <Button
              key="home"
              style={{ margin: "10px 5px 0px 5px" }}
              type="primary"
              onClick={() => {
                nav("/main/studentpage");
                Modal.destroyAll();
              }}
            >
              Home
            </Button>,
            <Button
              key="payment"
              style={{ backgroundColor: "green", margin: "10px 5px 0px 5px" }}
              type="primary"
              onClick={() => {
                console.log("Payment button clicked");
                nav("/main/studentpage/feereceipt");
                Modal.destroyAll();
              }}
            >
              Payment
            </Button>,
            <Button
              key="addStudent"
              type="primary"
              style={{ margin: "10px 5px 0px 5px" }}
              ghost
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                Modal.destroyAll();
              }}
            >
              Add Student
            </Button>,
          ],
        });
      })
      .catch((err) => {
        console.log(err.response.data.ErrorMessage);
        message.error(err.response.data.ErrorMessage);
      });
  };

  const onFinishFailed = (err) => {
    console.log(err);
  };

  useEffect(() => {
    console.log(dbInfo);
    setselectorsList(
      dbInfo.isSelectorReady
        ? dbInfo.selectors
        : {
            boardTypes: [],
            gradeTypes: [],
            id: 0,
            paymentTypes: [],
            studentStatusTypes: [],
            subjectTypes: [],
            transactionTypes: [],
            transactionsCategoryTypes: [],
          }
    );
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const mySpans = {
    xs: 24,
    sm: 24,
    md: 10,
    lg: 11,
    xl: 11,
    xxl: 5,
  };

  const fromAlign = {
    span: windowsSize.width < 577 ? 24 : 12,
  };

  const studentFormStyle =
    windowsSize.width < 577
      ? {
          padding: "10px",
          height: "calc(100vh - 170px)",
          overflow: "auto",
        }
      : {
          padding: "10px",
          height: "calc(100vh - 140px)",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        };

  return (
    <Container>
      <Backnavigationbtn title={"New Student Form"} />
      <Form
        style={studentFormStyle}
        name="newStudent"
        form={form}
        labelWrap
        size={
          windowsSize.width < 577
            ? "small"
            : windowsSize.width > 576 && windowsSize.width < 1440
            ? "middle"
            : "large"
        }
        variant="filled"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
      >
        <Row gutter={windowsSize.width < 577 ? 0 : [30, 5]} align="center">
          <Col {...fromAlign}>
            <Form.Item
              label="Name"
              name="name"
              rules={[formValidations.Strings]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Class No"
              name="classNo"
              rules={[formValidations.Strings]}
            >
              <Select
                options={arrayOfStringConverter(selectorsList.gradeTypes)}
              />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="School Name"
              name="schoolName"
              rules={[formValidations.Strings]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Board Type"
              name="boardType"
              rules={[formValidations.Strings]}
            >
              <Select
                options={arrayOfStringConverter(selectorsList.boardTypes)}
              />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Status"
              name="studentStatus"
              rules={[formValidations.Strings]}
            >
              <Select
                options={arrayOfStringConverter(
                  selectorsList.studentStatusTypes
                )}
              />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Past Grade"
              name="pastScore"
              rules={[formValidations.Strings, formValidations.Score]}
            >
              <Input suffix="%" />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Subjects"
              name="subjectsTaken"
              rules={[formValidations.Strings]}
            >
              <Select
                mode="multiple"
                allowClear
                options={arrayOfStringConverter(selectorsList.subjectTypes)}
              />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Timings"
              name="timing"
              rules={[formValidations.Strings]}
            >
              <StepperInput value={timing} onChange={setTiming} />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Parent Name"
              name="parentName"
              rules={[formValidations.Strings]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Parent Phn.No"
              name="parentPhnNo"
              rules={[formValidations.Strings, formValidations.PhoneNumbers]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="WhatsApp No"
              rules={[formValidations.Strings, formValidations.PhoneNumbers]}
              name="whatsappNo"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col {...fromAlign}>
            <Form.Item
              label="Tution Fee Per Month"
              name="feeCharge"
              rules={[formValidations.Strings, formValidations.Numbers]}
            >
              <Input suffix="₹ /- " />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row justify="space-around">
            <Button
              type="primary"
              htmlType="reset"
              ghost
              danger
              onClick={() => form.resetFields()}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Container>
  );
};
