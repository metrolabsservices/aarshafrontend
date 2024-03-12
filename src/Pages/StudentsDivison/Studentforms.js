import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  TimePicker,
  message,
} from "antd";
import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import { optionMasterTypes } from "../../GenericComponents/OptionsMasterRecord";
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
  const nav = useNavigate();
  const onFinish = async (e) => {
    // console.log("submit action -- ", e);
    let data = {
      ...e,
      previousScore: parseInt(e.previousScore),
      feeCharge: parseInt(e.feeCharge),
      duration:
        String(new Date(e.duration).getHours()) +
        ":" +
        String(new Date(e.duration).getMinutes()),
      joiningDate: new Date().toISOString(),
    };

    // console.log("modified data -", data);
    await axiosInstance
      .post(API.STUDENT_BY_ID + "create", data)
      .then((res) => {
        console.log(res);
        Modal.confirm({
          title: `${res.data.response}`,
          content: ` ${toCaptalizeString(data.name)} is registred with ${
            res.data.data
          } ID`,
          centered: true,
          keyboard: false,
          icon: <CheckCircleTwoTone twoToneColor="green" />,
          closeIcon: <CheckCircleTwoTone twoToneColor="green" />,
          cancelText: "Add Student",
          onCancel() {
            form.resetFields();
          },
          cancelButtonProps: {
            type: "primary",
            ghost: true,
            icon: <PlusOutlined />,
          },
          okText: "Home",
          onOk() {
            nav("/Home_B");
          },
        });
      })
      .catch((err) => {
        // console.log(err.response.data.ErrorMessage);
        message.error(err.response.data.ErrorMessage);
      });
  };
  const onFinishFailed = (err) => {
    console.log(err);
  };
  return (
    <Container>
      <Backnavigationbtn title={"New Student Form"} />
      <Form
        className="studentFormStyle"
        name="newStudent"
        form={form}
        labelWrap
        size="small"
        variant="filled"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
      >
        <Form.Item label="Name" name="name" rules={[formValidations.Strings]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Class No"
          name="gradeNumber"
          rules={[formValidations.Strings]}
        >
          <Select
            options={arrayOfStringConverter(optionMasterTypes.gradeTypes)}
          />
        </Form.Item>
        <Form.Item
          label="School Name"
          name="schoolName"
          rules={[formValidations.Strings]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Board"
          name="boardType"
          rules={[formValidations.Strings]}
        >
          <Select
            options={arrayOfStringConverter(optionMasterTypes.boardTypes)}
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[formValidations.Strings]}
        >
          <Select
            options={arrayOfStringConverter(
              optionMasterTypes.studentStatusTypes
            )}
          />
        </Form.Item>
        <Form.Item
          label="Past Grade"
          name="previousScore"
          rules={[formValidations.Strings, formValidations.Score]}
        >
          <Input suffix="%" />
        </Form.Item>
        <Form.Item
          label="Subjects"
          name="subjectsAcquired"
          rules={[formValidations.Strings]}
        >
          <Select
            mode="multiple"
            allowClear
            options={arrayOfStringConverter(optionMasterTypes.subjects)}
          />
        </Form.Item>

        <Form.Item
          label="Timings"
          name="duration"
          rules={[formValidations.Strings]}
        >
          <TimePicker
            style={{ width: "100%" }}
            format="HH:mm"
            // defaultValue={dayjs("02:00", "HH:mm")}
            showNow={false}
          />
        </Form.Item>
        <Form.Item
          label="Guardian Name"
          name="guardianName"
          rules={[formValidations.Strings]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Guardian Phn No"
          name="guardianPhoneNumber"
          rules={[formValidations.Strings, formValidations.PhoneNumbers]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Fee Amount"
          name="feeCharge"
          rules={[formValidations.Strings, formValidations.Numbers]}
        >
          <Input suffix="₹ /- " />
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
    </Container>
  );
};
