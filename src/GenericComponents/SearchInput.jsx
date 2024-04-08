import {
  ArrowUpOutlined,
  FileAddOutlined,
  TransactionOutlined,
  PlusCircleTwoTone,
  SearchOutlined,
  SyncOutlined,
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
  Layout,
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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../services/axiosInstance";
import { API } from "../services/api.constants";
import {
  toCaptalizeString,
  toDateConverter,
  toDescriptionsItemsConvert,
} from "./Modifiers";
import { Backnavigationbtn } from "./Backnavigationbtn";
import { Titlecustom } from "./Titlecustom";

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
const datae = [
  {
    boardType: "SSC",
    classNo: "Class-1",
    dueAmount: 9608,
    feeCharge: [
      { amount: 2916, dateOfCharged: "2023-03-07T23:49:11.000Z" },
      { amount: 8375, dateOfCharged: "2023-08-21T02:39:16.000Z" },
    ],
    feeDetails: [
      { dateOfPaid: "2023-10-22T15:13:01.000Z", paidAmount: 6188 },
      { dateOfPaid: "2023-07-27T06:44:26.000Z", paidAmount: 6633 },
    ],
    id: 17,
    isDeleted: false,
    joiningDate: "2022-05-10T20:14:53.000Z",
    name: "Mildred Lytle",
    parentName: "Rudyard Lowcock",
    parentPhnNo: "5681894273",
    pastScore: 69,
    schoolName: "First Trust Mega Cap AlphaDEX Fund",
    studentStatus: "active",
    subjectsTaken: ["English", "Maths"],
    timing: "5:30",
    whatsappNo: "3799477569",
  },
  {
    boardType: "CBSE",
    classNo: "Class-2",
    dueAmount: 5000,
    feeCharge: [],
    feeDetails: [],
    id: 18,
    isDeleted: false,
    joiningDate: "2023-01-15T10:00:00.000Z",
    name: "John Doe",
    parentName: "Jane Doe",
    parentPhnNo: "1234567890",
    pastScore: 85,
    schoolName: "ABC School",
    studentStatus: "active",
    subjectsTaken: ["Science", "Social Studies"],
    timing: "9:00",
    whatsappNo: "9876543210",
  },
  {
    boardType: "ICSE",
    classNo: "Class-3",
    dueAmount: 3000,
    feeCharge: [{ amount: 3000, dateOfCharged: "2023-02-20T12:00:00.000Z" }],
    feeDetails: [{ dateOfPaid: "2023-02-25T12:00:00.000Z", paidAmount: 3000 }],
    id: 19,
    isDeleted: false,
    joiningDate: "2023-03-01T09:00:00.000Z",
    name: "Alice Smith",
    parentName: "Bob Smith",
    parentPhnNo: "1112223333",
    pastScore: 92,
    schoolName: "XYZ School",
    studentStatus: "active",
    subjectsTaken: ["Mathematics", "English"],
    timing: "10:30",
    whatsappNo: "9998887777",
  },
  {
    boardType: "SSC",
    classNo: "Class-1",
    dueAmount: 9608,
    feeCharge: [
      { amount: 2916, dateOfCharged: "2023-03-07T23:49:11.000Z" },
      { amount: 8375, dateOfCharged: "2023-08-21T02:39:16.000Z" },
    ],
    feeDetails: [
      { dateOfPaid: "2023-10-22T15:13:01.000Z", paidAmount: 6188 },
      { dateOfPaid: "2023-07-27T06:44:26.000Z", paidAmount: 6633 },
    ],
    id: 17,
    isDeleted: false,
    joiningDate: "2022-05-10T20:14:53.000Z",
    name: "Mildred Lytle",
    parentName: "Rudyard Lowcock",
    parentPhnNo: "5681894273",
    pastScore: 69,
    schoolName: "First Trust Mega Cap AlphaDEX Fund",
    studentStatus: "active",
    subjectsTaken: ["English", "Maths"],
    timing: "5:30",
    whatsappNo: "3799477569",
  },
  {
    boardType: "CBSE",
    classNo: "Class-2",
    dueAmount: 5000,
    feeCharge: [],
    feeDetails: [],
    id: 18,
    isDeleted: false,
    joiningDate: "2023-01-15T10:00:00.000Z",
    name: "John Doe",
    parentName: "Jane Doe",
    parentPhnNo: "1234567890",
    pastScore: 85,
    schoolName: "ABC School",
    studentStatus: "active",
    subjectsTaken: ["Science", "Social Studies"],
    timing: "9:00",
    whatsappNo: "9876543210",
  },
  {
    boardType: "ICSE",
    classNo: "Class-3",
    dueAmount: 3000,
    feeCharge: [{ amount: 3000, dateOfCharged: "2023-02-20T12:00:00.000Z" }],
    feeDetails: [{ dateOfPaid: "2023-02-25T12:00:00.000Z", paidAmount: 3000 }],
    id: 19,
    isDeleted: false,
    joiningDate: "2023-03-01T09:00:00.000Z",
    name: "Alice Smith",
    parentName: "Bob Smith",
    parentPhnNo: "1112223333",
    pastScore: 92,
    schoolName: "XYZ School",
    studentStatus: "active",
    subjectsTaken: ["Mathematics", "English"],
    timing: "10:30",
    whatsappNo: "9998887777",
  },
];

export const SearchInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const [payValue, setPayValue] = useState({
    value: "",
    errorMessage: "",
    isError: false,
  });
  const [searchBox, setsearchBox] = useState("");
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [data, setData] = useState([]);
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

  const apiUpdate = async () => {
    console.log("update API called -----");
    // await axiosInstance.put();
  };
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

    apiCall();
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchValue]);

  const onSearchHandler = (e) => {
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
  const payHandler = (e) => {
    if (/^[0-9]+$/.test(e)) {
      if (parseInt(e) <= pageData.dueAmount) {
        setPayValue({ value: e, errorMessage: "", isError: false });
      } else {
        setPayValue({
          value: e,
          isError: true,
          errorMessage: "Entered value is higher than due amount",
        });
      }
    } else {
      setPayValue({
        value: e,
        isError: true,
        errorMessage: "Only Numeric Value are Valid",
      });
    }
  };
  const onPayClicked = (e) => {
    console.log("on Pay Clicked -- ", payValue);
    if (payValue.value === "") {
      message.error("No Input, Check the Pay Input Entered");
    } else if (payValue.isError) {
      message.error("Invalid Input, Check the Pay Input Entered");
    } else if (payValue.value.length > 0 && !payValue.isError) {
      apiUpdate(e);
    } else {
      message.error("Unexpected Failure, Click REST button and try again");
    }
  };
  const resetHandler = (e) => {
    setSearchValue("");
    setBolMang({
      isLoaded: true,
      isError: false,
      isListHide: true,
      isPageDataHide: true,
      isPaidClosed: false,
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
                <>
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
                </>
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
            <Col {...respBreak}>
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
            </Col>
            <Col {...respBreak}>
              <Typography.Text
                hidden={!payValue.isError}
                type="danger"
                strong
                style={{ alignItems: "center" }}
              >
                {payValue.errorMessage}
              </Typography.Text>
              <Space.Compact block size="large">
                <Input
                  placeholder="Enter the amount"
                  status={payValue.isError ? "error" : ""}
                  value={payValue.value}
                  onChange={(e) => payHandler(e.target.value)}
                />
                <Button
                  icon={<TransactionOutlined />}
                  style={{ backgroundColor: "#9df596" }}
                  onClick={() => onPayClicked()}
                >
                  PAY
                </Button>
              </Space.Compact>
            </Col>
          </Row>
        </div>
      </Spin>
    </Container>
  );
};
