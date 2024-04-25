import {
  ArrowUpOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  PlusCircleTwoTone,
  SearchOutlined,
  SyncOutlined,
  SecurityScanTwoTone,
} from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  FloatButton,
  Input,
  Modal,
  List,
  Popover,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
  Form,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../services/axiosInstance";
import { API } from "../services/api.constants";
import {
  arrayOfStringConverter,
  formValidations,
  toCaptalizeString,
  toDateConverter,
  toDescriptionsItemsConvert,
} from "./Modifiers";
import ReactDOM, { createRoot } from "react-dom";
import { Titlecustom } from "./Titlecustom";
import { useGuard } from "../dbHub/GuardContext";
import { useNavigate } from "react-router-dom";
import { ReceiptGenerater } from "./ReceiptGenerater";
import { width } from "@fortawesome/free-solid-svg-icons/faEnvelopeCircleCheck";
const Container = styled.div`
  & .selectorBox {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  & .ant-list-items {
    width: 100%;
  }
  & .ant-list-footer {
    padding: 0%;
    text-align: center;
  }

  & .ant-table-thead > .ant-table-cell {
    text-align: center;
  }
`;

export const SearchInput = () => {
  const { dbInfo, updateDB } = useGuard();
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [subjectSelect, setSubjectSelect] = useState({
    subjectsTaken: [],
    isError: true,
  });
  const [payValue, setPayValue] = useState({
    value: "",
    errorMessage: "",
    isError: false,
  });
  const [mySelectors, setSelectors] = useState({ subjects: [], modeOfPay: [] });
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [data, setData] = useState([]);
  const [backUpInfo, setBackUPInfo] = useState({});
  const [pageData, setpageData] = useState({
    personalData: [],
    feeCharge: [
      { amount: 0, dateOfCharged: "" },
      { amount: 0, dateOfCharged: "" },
    ],
    feeDetails: [
      { paidAmount: 0, dateOfPaid: "" },
      { paidAmount: 0, dateOfPaid: "" },
    ],
    totalFeecharged: 0,
    totalFeepaid: 0,
    dueAmount: 0,
  });
  const [bolMang, setBolMang] = useState({
    isLoaded: true,
    isError: false,
    isListHide: true,
    isPageDataHide: true,
    isPaidClosed: false,
  });
  const [isDefaultResult, setIsDefaultResult] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // console.log(window.innerWidth, window.innerHeight);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const apiCall = async () => {
      await axiosInstance
        .post(API.STUDENT_BY_NAME, { searchIput: searchValue })
        .then((result) => {
          console.log("--- Search --- ", result.data);
          setData(result.data);
          setBolMang({ ...bolMang, isError: false, isLoaded: false });
        })
        .catch((err) => {
          console.log(err);
          setBolMang({ ...bolMang, isError: true, isLoaded: false });
        });
    };
    setSelectors(
      dbInfo.isSelectorReady
        ? {
            subjects: arrayOfStringConverter(dbInfo.selectors.subjectTypes),
            modeOfPay: arrayOfStringConverter(dbInfo.selectors.paymentTypes),
          }
        : { subjects: [], modeOfPay: [] }
    );
    apiCall();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchValue]);

  const onSearchHandler = (e) => {
    setIsDefaultResult(true);
    setSearchValue(e);
    e.length > 0
      ? setBolMang({ ...bolMang, isListHide: false })
      : setBolMang({ ...bolMang, isListHide: true });
  };
  const respBreak = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };
  const selectorBox = {
    margin: "20px 5px",
    width: windowsSize.width < 577 ? "100%" : "80%",
    textAlign: "center",
  };
  const listStyling = {
    height: "calc(100vh - 400px)",
    // width: `calc(100vw - 20px)`,
    padding: "10px",
    border: "1px solid white",
    borderRadius: "10px",
    overflowY: "scroll",
    overflowX: "hidden",
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  };
  const headerStyles = {
    title: {
      style: {
        margin: "0px",
        fontWeight: "bold",
      },
    },
    description: {
      style: {
        fontSize: "11px",
      },
    },
    addButton: {
      style: {
        fontSize: "25px",
      },
    },
    divider: {
      style: {
        margin: "7px 3px",
      },
    },
  };
  const pageDataStyles = {
    style: {
      height: "calc(100vh - 250px)",
      overflowY: "scroll",
      overflowX: "hidden",
    },
  };
  const scrollUp = () => {
    // console.log("--- Scroll up ---");
    const firstItem = document.querySelector(
      ".ant-list-items > div:first-child"
    );
    if (firstItem) {
      firstItem.scrollIntoView({ behavior: "smooth" });
    }
  };
  const recordSelectedHandler = (e) => {
    console.log(e);
    const { feeCharge, feeDetails, ...rest } = e;
    setBackUPInfo(rest);
    let descriptionData = Object.entries(rest).map((i) =>
      toDescriptionsItemsConvert(i)
    );

    setpageData({
      personalData: descriptionData,
      feeCharge: feeCharge,
      feeDetails: feeDetails,
      totalFeecharged: feeCharge.reduce((acc, { amount }) => acc + amount, 0),
      totalFeepaid:
        feeDetails.length > 0
          ? feeDetails.reduce((acc, { paidAmount }) => acc + paidAmount, 0)
          : (setBolMang({ ...bolMang, isPaidClosed: true }), 0),
      dueAmount: e.dueAmount,
    });

    setBolMang({ ...bolMang, isListHide: true, isPageDataHide: false });
  };
  const onFinish = async (e) => {
    console.log("------- Form Data --------", e, backUpInfo);

    const pack = {
      data: {
        paidAmount: parseInt(e.paidAmount),
        subjectsTaken: e.subjectsTaken,
        dateOfPaid: new Date().toISOString(),
        studentId: backUpInfo.id,
      },
      info: {
        id: backUpInfo.id,
        name: backUpInfo.name,
        modeOfPayment: e.modeOfPayment,
        dueAmount: backUpInfo.dueAmount - parseInt(e.paidAmount),
      },
    };

    console.log("Final Set----", pack);

    await axiosInstance
      .post(API.STUDENT_FEE_BY_ID, pack)
      .then((result) => {
        updateDB({ isPrintReady: true, printer: result.data });
        nav("/fee");
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = (e) => {
    console.log("------ Failed Form ----------", e);
  };
  const resetHandler = (e) => {
    setSearchValue("");
    setBackUPInfo({});
    setBolMang({
      isLoaded: true,
      isError: false,
      isListHide: true,
      isPageDataHide: true,
      isPaidClosed: false,
    });
    setIsDefaultResult(false);
    setPayValue({
      value: "",
      errorMessage: "",
      isError: false,
    });
    setSubjectSelect({
      subjectsTaken: [],
      isError: true,
    });
  };

  return (
    <Container>
      <Flex justify="center" align="center" vertical>
        <Space.Compact
          style={selectorBox}
          size={windowsSize.width < 577 ? "small" : "middle"}
        >
          <Input
            suffix={<SearchOutlined />}
            onChange={(e) => onSearchHandler(e.target.value)}
            value={searchValue}
          />
          <Button type="primary" onClick={() => resetHandler()}>
            Reset
          </Button>
        </Space.Compact>
      </Flex>
      <Spin spinning={bolMang.isLoaded}>
        {bolMang.isError ? (
          <Result
            status="error"
            title="Backend Failed"
            subTitle="Enable to get Search Data problem with Input, Reset and try again."
          />
        ) : (
          <div hidden={bolMang.isListHide}>
            <List
              style={listStyling}
              dataSource={data}
              footer={
                <Button
                  shape="circle"
                  ghost
                  type="primary"
                  icon={<ArrowUpOutlined />}
                  onClick={scrollUp}
                />
              }
              renderItem={(item, index) => (
                <div id={index + "_list"}>
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}
                  >
                    <Space direction="vertical" size={0}>
                      <Typography.Text {...headerStyles.title}>
                        {item.name} - ID {item.id}
                      </Typography.Text>
                      <Typography.Text {...headerStyles.description}>
                        {item.parentName}, Phn.No - {item.parentPhnNo}
                      </Typography.Text>
                    </Space>
                    <PlusCircleTwoTone
                      {...headerStyles.addButton}
                      onClick={() => recordSelectedHandler(item)}
                    />
                  </Flex>
                  <Divider {...headerStyles.divider} />
                </div>
              )}
            />
          </div>
        )}
        <div hidden={bolMang.isPageDataHide} {...pageDataStyles}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Descriptions
                bordered
                size="small"
                items={pageData.personalData}
              />
            </Col>
            <Col span={24}>
              <Flex justify="center" align="center" vertical={false}>
                <Form
                  style={windowsSize.width > 577 ? { width: "60%" } : {}}
                  size={windowsSize.width > 577 ? "large" : "middle"}
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  requiredMark={false}
                >
                  <Form.Item>
                    <Titlecustom
                      props={{
                        level: 4,
                        data: `Payment Form`,
                        style: {
                          textAlign: "center",
                          margin: "0px",
                          color: "blue",
                          textDecoration: "underline",
                        },
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Subjects"
                    rules={[formValidations.Strings]}
                    name="subjectsTaken"
                  >
                    <Select
                      maxTagCount="responsive"
                      mode="multiple"
                      options={mySelectors.subjects}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Amount"
                    name="paidAmount"
                    rules={[
                      { required: true, message: "Amount is required" },
                      {
                        pattern: /^[1-9]\d*$/,
                        message: "Only positive numerical values are allowed",
                      },
                      {
                        validator: (_, value) =>
                          formValidations
                            .LessThanTarget(backUpInfo.dueAmount)
                            .validator(_, value),
                      },
                      {
                        validator: (_, value) =>
                          formValidations.NonNegative.validator(_, value),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Mode of Pay"
                    name="modeOfPayment"
                    rules={[formValidations.Strings]}
                  >
                    <Select
                      maxTagCount="responsive"
                      options={mySelectors.modeOfPay}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Flex justify="space-around" align="center">
                      <Button onClick={() => form.resetFields()}>Reset</Button>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Flex>
                  </Form.Item>
                </Form>
              </Flex>
            </Col>
            <Col {...respBreak}>
              <Table
                title={() => (
                  <Titlecustom
                    props={{ level: 5, data: "Fee Charge Details" }}
                  />
                )}
                footer={() => (
                  <Titlecustom
                    props={{
                      level: 4,
                      data: `Total Fee  - ₹ ${pageData.totalFeecharged} /-`,
                    }}
                  />
                )}
                columns={[
                  {
                    title: "Date",
                    dataIndex: "dateOfCharged",
                    key: "dateOfCharged",
                    align: "center",
                    render: (rec, _) =>
                      toDateConverter({ type: "normal", data: rec }),
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    align: "center",

                    render: (rec, _) => `₹ ${rec} /- `,
                  },
                ]}
                dataSource={pageData.feeCharge}
                pagination={false}
                bordered={true}
                size="small"
              />
            </Col>
            <Col {...respBreak}>
              <Table
                title={() => (
                  <Titlecustom props={{ level: 5, data: "Payed Details" }} />
                )}
                footer={() => (
                  <Titlecustom
                    props={{
                      level: 4,
                      data: `Total Payed - ₹ ${pageData.totalFeepaid} /-`,
                    }}
                  />
                )}
                columns={[
                  {
                    title: "Date",
                    dataIndex: "dateOfPaid",
                    key: "dateOfPaid",
                    align: "center",
                    render: (rec, _) =>
                      toDateConverter({ type: "normal", data: rec }),
                  },
                  {
                    title: "Amount",
                    dataIndex: "paidAmount",
                    key: "paidAmount",
                    align: "center",

                    render: (rec, _) => `₹ ${rec} /- `,
                  },
                ]}
                dataSource={pageData.feeDetails}
                pagination={false}
                bordered={true}
                size="small"
              />
            </Col>
            {/* <Col {...respBreak}>
              <Titlecustom
                props={{
                  level: 3,
                  data: `Due Amount ₹${pageData.dueAmount}/-`,
                  style: {
                    textAlign: "center",
                    margin: "0px",
                    color: "red",
                  },
                }}
              />
            </Col> */}
          </Row>
        </div>
        <div hidden={isDefaultResult}>
          <Result
            style={{ padding: "10px" }}
            icon={<SecurityScanTwoTone />}
            title="Please note only the search function triggers page changes. Thank you"
          />
        </div>
      </Spin>
    </Container>
  );
};
