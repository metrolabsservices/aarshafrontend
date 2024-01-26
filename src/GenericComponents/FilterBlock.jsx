import { CloseCircleTwoTone } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  FloatButton,
  Form,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { arrayOfStringConverter } from "./OptionsMasterRecord";
const Container = styled.div`
  padding: 0px;
  margin: 0px;
  /* height: 200px; */
  & .formstyling {
    padding: 0px 8px 0px 10px;
  }
  & .close_btn {
    padding: 0%;
    margin: 0%;
  }
`;

export const FilterBlock = ({
  onClose,
  type,
  options,
  mainKey,
  tableOutput,
  isReset,
}) => {
  const [form] = Form.useForm();
  const onFinsih = (e) => {
    let modifiedObject = Object.entries(e);
    modifiedObject = {
      key: modifiedObject[0][0],
      value: modifiedObject[0][1],
      operation: type.endsWith("Selector") ? "search" : "none",
    };
    // console.log(modifiedObject, "form output ---");
    tableOutput({ [mainKey]: modifiedObject });
    onClose();
  };

  function selectorAdjust() {
    if (type == "multiSelector") {
      return (
        <Checkbox.Group>
          <Row>
            {options.map((i, j) => (
              <Col span={20} offset={3} key={`${i}_${j}`}>
                <Checkbox value={i}>{i}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      );
    } else if (type == "searchSelector") {
      return (
        <Select
          mode="multiple"
          options={arrayOfStringConverter(options)}
          maxTagCount="responsive"
          listHeight={100}
        />
      );
    }
  }

  const onReset = (e) => {
    tableOutput({ reset: mainKey });
    onClose();
  };
  useEffect(() => {
    console.log("reset in Filter Block");
    if (isReset) {
      form.resetFields();
    }
  }, [isReset]);

  return (
    <Container>
      <Row justify="end">
        <Button
          className="close_btn"
          type="link"
          icon={<CloseCircleTwoTone twoToneColor="red" />}
          onClick={() => {
            onClose();
          }}
          size="large"
        />
      </Row>

      <Form
        // form={form}
        className="formstyling"
        onFinish={onFinsih}
        size="small"
      >
        <Form.Item name={mainKey}>{selectorAdjust()}</Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Button
              className="btn_adjustment"
              type="primary"
              ghost
              htmlType="reset"
              onClick={onReset}
            >
              Reset
            </Button>
            <Button className="btn_adjustment" htmlType="submit" type="primary">
              Submit
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Container>
  );
};
