import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Flex,
  Form,
  Input,
  Result,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import {
  arrayOfStringConverter,
  formValidations,
  toDateConverter,
  toDescriptionsItemsConvert,
} from "../../GenericComponents/Modifiers";
import { CustomSelectorsList } from "../../GenericComponents/SelectorsApi";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday"; // Add this line
import "dayjs/locale/en"; // Ensure to import the desired locale

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(weekday); // Add this line
dayjs.locale("en"); // Set the desired locale

const Container = styled.div`
  & .formBox {
    /* border: 1px solid red; */
    border-radius: 15px;
    margin: 20px 30px 0px 30px;
    padding: 10px 20px;
    height: 90%;
  }
  & .formContainer {
    display: flex;
    overflow-y: auto;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* border: 1px solid green; */
  }
`;
export const TransactionForm = () => {
  const [form] = Form.useForm();
  const { id, type } = useParams();
  const [rawData, setRawData] = useState({});
  const [descriptionData, setDescriptionData] = useState([]);
  const [selectorsList, setselectorsList] = useState({});
  const [bolMang, setbolMang] = useState({
    isError: false,
    errorMessage: "Dummy Error",
    isFormAvailable: false,
    isLoaded: true,
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // console.log(id, type, "---- Form Page Data", "view" == type);

  let formSpans = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 6,
  };

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const customDateFormatter_Forms = (currentDateValue) => {
    return `${String(currentDateValue.getDate()).padStart(2, "0")}/${String(
      currentDateValue.getMonth() + 1
    ).padStart(2, "0")}/${currentDateValue.getFullYear()}`;
  };

  useEffect(() => {
    const apiCall = async (id) => {
      await axiosInstance
        .get(API.TRANSACTION_BY_ID + id)
        .then((result) => {
          console.log("api called --- ", type);

          let rawDataSet = Object.entries(result.data);
          rawDataSet = rawDataSet.map((i) => toDescriptionsItemsConvert(i));
          const descriptionItem = rawDataSet.find(
            (item) => item.label === "Description"
          );
          const filteredData = rawDataSet.filter(
            (item) => item.label !== "Id" && item.label !== "Description"
          );
          filteredData.push(descriptionItem);
          console.log(rawDataSet, filteredData);
          setRawData(result.data);
          setDescriptionData(filteredData);

          if (type === "edit") {
            const insertDate = customDateFormatter_Forms(
              new Date(result.data.dateOfPayment)
            );
            form.setFieldsValue({
              ...result.data,
              dateOfPayment: dayjs(insertDate, "DD-MM-YYYY"),
            });
          }

          // setbolMang({
          //   isFormAvailable: true,
          //   isError: false,
          //   errorMessage: "",
          //   isLoaded: false,
          // });
        })
        .catch((err) => {
          setbolMang({
            ...bolMang,
            isError: true,
            isLoaded: false,
            errorMessage: "Unable to Fetch Data",
          });
        });
    };

    const selectorSemiApi = async () => {
      const mySelectors = await CustomSelectorsList();
      mySelectors.response
        ? setselectorsList(mySelectors.data)
        : setbolMang({
            ...bolMang,
            isError: true,
            errorMessage: "Unable to get Selectors - Backend Failed",
          });
    };

    console.log(type, typeof type, id, typeof id);

    if (typeof type == "undefined" && typeof id == "undefined") {
      setbolMang({
        ...bolMang,
        isError: true,
        errorMessage: "Invalid URL path",
      });
    } else if (type == "view") {
      apiCall(id);
      setbolMang({ ...bolMang, isFormAvailable: false, isLoaded: false });
    } else if (type == "edit") {
      apiCall(id);
      selectorSemiApi();
      setbolMang({ ...bolMang, isFormAvailable: true, isLoaded: false });
    } else if (type == "add") {
      const currentDateValue = new Date();
      let endVlv = customDateFormatter_Forms(currentDateValue);
      // console.log(endVlv, "DD/MM/YYYY");

      const datees = dayjs(endVlv, "DD/MM/YYYY");
      // console.log(datees);
      form.setFieldsValue({
        dateOfPayment: datees,
        itemName: "",
      });
      selectorSemiApi();
      setbolMang({ ...bolMang, isFormAvailable: true, isLoaded: false });
    } else {
      setbolMang({
        ...bolMang,
        isError: true,
        errorMessage: "Unable to Access Location",
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id, type]);

  const onFinish = async (vlv) => {
    // console.log(vlv, "onFinsih Submit data", type, id);
    let data = {
      ...vlv,
      amount: parseInt(vlv.amount),
      dateOfPayment: toDateConverter({ type: "ISO", data: vlv.dateOfPayment }),
    };

    console.log(data, vlv);

    if (type == "add") {
      await axiosInstance
        .post(API.TRANSACTION_BY_ID + "create", data)
        .then((result) => {
          console.log(result.data);
          message.success(`Successfully created ${data.itemName}`);
        })
        .catch((err) => {
          console.log(err.data);
          message.error("Failed to add record ");
        });
    } else if (type == "edit") {
      await axiosInstance
        .put(API.TRANSACTION_BY_ID + id, data)
        .then((result) => {
          console.log(result.data);
          message.success(`Successfully Updated ${data.itemName}`);
        })
        .catch((err) => {
          console.log(err.data);
          message.error("Failed to Update record ");
        });
    }
  };

  const onFinishFailed = (vlv) => {
    // console.log(vlv, "onFinsh Value Datas");
    message.error("Failed to submit the form");
  };

  return (
    <Container>
      <Backnavigationbtn
        title={
          type === "edit"
            ? "Edit Form"
            : type === "add"
            ? "Add New Transaction"
            : "Transaction Details"
        }
      />
      <Flex
        justify="center"
        className="formContainer"
        style={{
          height:
            windowSize.width < 577
              ? "calc(100vh - 180px)"
              : "calc(100vh - 150px)",
        }}
      >
        <Spin spinning={bolMang.isLoaded}>
          {bolMang.isError ? (
            <Result
              className="errorBox"
              status="warning"
              title="Sorry, something went wrong"
              subTitle={bolMang.errorMessage}
            />
          ) : bolMang.isFormAvailable ? (
            <div className="formBox" hidden={type == "view"}>
              <Form
                form={form}
                size={windowSize.width < 577 ? "small" : "large"}
                requiredMark={false}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Row gutter={[20, 10]}>
                  <Col {...formSpans}>
                    <Form.Item
                      name="itemName"
                      label="Key Note"
                      rules={[formValidations.Strings]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...formSpans}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[formValidations.Strings]}
                    >
                      <Select
                        options={arrayOfStringConverter(
                          selectorsList.transactionCategories
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[formValidations.Strings]}
                    >
                      <Input.TextArea />
                    </Form.Item>
                  </Col>
                  <Col {...formSpans}>
                    <Form.Item
                      name="modeOfPayment"
                      label="Type Pay"
                      rules={[formValidations.Strings]}
                    >
                      <Select
                        options={arrayOfStringConverter(
                          selectorsList.paymentTypes
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formSpans}>
                    <Form.Item
                      name="transactionMode"
                      label="Transaction Mode"
                      rules={[formValidations.Strings]}
                    >
                      <Select
                        options={arrayOfStringConverter(
                          selectorsList.transactionMode
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col {...formSpans}>
                    <Form.Item
                      name="dateOfPayment"
                      label="Pay Date"
                      rules={[formValidations.Strings]}
                    >
                      <DatePicker picker="date" format="DD-MM-YYYY" />
                    </Form.Item>
                  </Col>
                  <Col {...formSpans}>
                    <Form.Item
                      name="amount"
                      label="Amount"
                      rules={[formValidations.Strings, formValidations.Numbers]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Flex justify="space-evenly" align="center">
                    <Button type="primary" ghost>
                      Reset
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Flex>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <Descriptions
              items={descriptionData}
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
            />
          )}
        </Spin>
      </Flex>
    </Container>
  );
};
