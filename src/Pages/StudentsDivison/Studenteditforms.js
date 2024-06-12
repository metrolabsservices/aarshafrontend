import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import { API } from "../../services/api.constants";
import axiosInstance from "../../services/axiosInstance";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Result,
  Row,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import {
  arrayOfStringConverter,
  formValidations,
} from "../../GenericComponents/Modifiers";
import { toDateConverter } from "./../../GenericComponents/Modifiers";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { StepperInput } from "../../GenericComponents/StepperInput";
const Container = styled.div`
  border: "1px solid red";
  & .stepperInput {
  }
`;

let mainContainer = {
  marginTop: "15px",
  // border: "1px solid red",
  padding: "10px",
  height: "calc(100vh - 185px)",
  overflowY: "auto",
};
export const Studenteditforms = () => {
  const { usertoken } = useParams();
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [userdata, setUserdata] = useState({});
  const [selectorsData, setSelectorsData] = useState({});
  const [timing, setTiming] = useState("1:00");
  const stepperTimeList = [
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
    "5:30",
    "6:00",
  ];
  const [response, setresponse] = useState({ isLoaded: true, isError: false });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const onFinish = async (prp) => {
    prp.joiningDate = new Date(prp.joiningDate).toISOString();
    console.log(prp);
    await axiosInstance
      .put(API.STUDENT_BY_ID + usertoken, prp)
      .then((result) => {
        // console.log(result);
        message.success("Record Updated");
        nav("/main/studentpage");
      })
      .catch((err) => {
        console.log(err);
        message.error("Failed to Update");
      });
  };

  const refineData = (prp) => {
    let refine = prp;
    refine.joiningDate = dayjs(
      new Date(refine.joiningDate).toLocaleDateString()
    );

    // console.log(refine);
    return refine;
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const apiCall = async () => {
      await axiosInstance
        .get(API.SELECTORS_GET)
        .then((result) => {
          // console.log(result.data);
          setSelectorsData(result.data);
        })
        .catch((err) => {
          message.error("Failed to get ");
          setresponse({ isLoaded: false, isError: true });
        });
      await axiosInstance
        .get(API.STUDENT_BY_ID + usertoken)
        .then((result) => {
          // refineData(result.data);
          // console.log(refineData(result.data));
          // let refine = refineData(result.data);
          // console.log(refine.extracted.feeDetails);
          form.setFieldsValue(refineData(result.data));
          setUserdata(refineData(result.data));
          setTiming(stepperTimeList.indexOf(result.data.timing));
          setresponse({ isLoaded: false, isError: false });
        })
        .catch((err) => {
          console.log(err);
          message.error("Server Issue");
          setresponse({ isLoaded: false, isError: true });
        });
    };

    apiCall();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  return (
    <Container>
      <Backnavigationbtn title="Edit Details" />
      {response.isError ? (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
        />
      ) : (
        <div style={mainContainer}>
          <Spin spinning={response.isLoaded}>
            <Form
              onFinish={onFinish}
              form={form}
              size="small"
              requiredMark={false}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[formValidations.Strings]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Class No"
                name="classNo"
                rules={[formValidations.Strings]}
              >
                <Select
                  options={arrayOfStringConverter(selectorsData["gradeTypes"])}
                />
              </Form.Item>
              <Form.Item
                label="Board"
                name="boardType"
                rules={[formValidations.Strings]}
              >
                <Select
                  options={arrayOfStringConverter(selectorsData["boardTypes"])}
                />
              </Form.Item>
              <Form.Item
                label="Parent Name"
                name="parentName"
                rules={[formValidations.Strings]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone No"
                name="parentPhnNo"
                rules={[formValidations.Strings, formValidations.PhoneNumbers]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Whatsapp No"
                name="whatsappNo"
                rules={[formValidations.Strings, formValidations.PhoneNumbers]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="School Name"
                name="schoolName"
                rules={[formValidations.Strings]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Student Status"
                name="studentStatus"
                rules={[formValidations.Strings]}
              >
                <Select
                  options={arrayOfStringConverter(
                    selectorsData["studentStatusTypes"]
                  )}
                />
              </Form.Item>
              <Form.Item
                label="Joining Date"
                name="joiningDate"
                rules={[formValidations.Strings]}
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item
                label="Due Amount"
                name="dueAmount"
                rules={[formValidations.Strings, formValidations.Numbers]}
              >
                <Input prefix="₹ " />
              </Form.Item>
              <Form.Item
                label="Timings"
                name="timing"
                rules={[formValidations.Strings]}
              >
                <StepperInput value={timing} onChange={setTiming} />
              </Form.Item>
              <Form.Item
                label="Current Subject"
                name="subjectsTaken"
                rules={[formValidations.Strings]}
              >
                <Select
                  mode="multiple"
                  options={arrayOfStringConverter(
                    selectorsData["subjectTypes"]
                  )}
                />
              </Form.Item>
              <Form.Item
                label="Past Score"
                name="pastScore"
                rules={[formValidations.Numbers, formValidations.Strings]}
              >
                <Input suffix="%" />
              </Form.Item>

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
          </Spin>
        </div>
      )}
    </Container>
  );
};
