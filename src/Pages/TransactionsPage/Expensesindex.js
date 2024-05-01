import {
  BarChartOutlined,
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { NavBtn } from "../../GenericComponents/NavBtn";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { toDateConverter } from "../../GenericComponents/Modifiers";
const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  /* height: 100vh; */
  overflow-y: scroll;
  overflow-x: hidden;
  & .navContainer {
    background-color: blueviolet;
    height: auto;
  }
  & .btnsSec {
    background-color: whitesmoke;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 20px;
  }
`;
export const Expensesindex = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [dataSource, setDataSource] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState({});
  const [apiIntercepter, setapiIntercepter] = useState(false);
  const [paginationMng, setpaginationMng] = useState({
    current: 1,
    pageSize: 5,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    const apiCall = async (Filters, PageData) => {
      console.log(Filters, PageData);
      await axiosInstance
        .get(API.TRANSACTION_BY_ALL, {
          params: {
            Pagination: PageData,
            Filters: Filters,
          },
        })
        .then((result) => {
          setDataSource(result.data);
          console.log("API result =---- ", result.data);
        })
        .catch((err) => {
          console.log("API Error ----------", err);
        });
    };
    apiCall(searchData, paginationMng);
  }, [searchData, apiIntercepter]);

  const searchHandler = (vlv) => {
    setSearchValue(vlv);
    setpaginationMng({
      current: 1,
      pageSize: 3,
    });

    let filter =
      vlv.length > 0
        ? /^\d+$/.test(vlv)
          ? {
              type: "number",
              value: parseInt(vlv),
            }
          : {
              type: "string",
              value: vlv,
            }
        : {};
    // console.log(filter, "--- filter data");
    setSearchData(filter);
  };

  const resetHandler = () => {
    setSearchValue("");

    setpaginationMng({
      current: 1,
      pageSize: 3,
    });
    setSearchData([]);
  };

  const ButtonsList = [
    {
      label: "Add Trnx",
      icon: <PlusOutlined />,
      routeLink: "/main/home/studentinfo",
      isDisabled: false,
    },
    {
      label: " Trnx Reports",
      icon: <BarChartOutlined />,
      routeLink: "/main/home/masterselectors",
      isDisabled: false,
    },
  ];

  const columns = [
    { title: "Trx ID", dataIndex: "id", key: "id", fixed: "left", width: 60 },
    { title: "Cause Note", dataIndex: "itemName", key: "itemName", width: 90 },
    {
      title: "Trx Brief",
      dataIndex: "description",
      key: "description",
      width: 150,
      responsive: ["lg"],
    },
    { title: "Category", dataIndex: "category", key: "category", width: 150 },
    {
      title: "Date",
      dataIndex: "dateOfPayment",
      key: "dateOfPayment",
      width: 150,
      render: (i, rec) => toDateConverter({ type: "normal", data: i }),
    },
    { title: "Amount", dataIndex: "amount", key: "amount", width: 70 },
    {
      title: "modeOfPayment",
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      width: 130,
    },
    {
      title: "Mode",
      dataIndex: "transactionMode",
      key: "transactionMode",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 95,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" wrap>
          <EditTwoTone />
          <EyeTwoTone />
          <Popconfirm
            title="are u sure ?"
            // onConfirm={() => itemDelete(record.id)}
          >
            <DeleteTwoTone />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Container>
      <Row gutter={[20, 30]} wrap className="btnsSec">
        {ButtonsList.map((i) => (
          <Col
            span={windowSize.width < 768 ? 12 : 6}
            style={{ textAlign: "center" }}
          >
            <NavBtn {...i} responsive={windowSize} />
          </Col>
        ))}
        <Col
          span={windowSize.width < 577 ? 24 : 12}
          style={{ textAlign: "center" }}
        >
          <Space.Compact block>
            <Input
              placeholder="search by name and id"
              onChange={(e) => searchHandler(e.target.value)}
              value={searchValue}
            />
            <Button type="primary" onClick={resetHandler}>
              Reset
            </Button>
          </Space.Compact>
        </Col>

        {/* <Col span={24}></Col> */}
      </Row>
      <Table
        columns={columns}
        dataSource={dataSource.items}
        scroll={{ x: 50, y: 320 }}
        pagination={false}
        bordered
        size="small"
      />
      <Pagination
        defaultCurrent={1}
        defaultPageSize={5}
        pageSizeOptions={[3, 5, 10, 20, 50, 100]}
        {...paginationMng} // current={} pageSize={}
        total={dataSource.totalCount}
        size="small"
        onChange={(page, pageSize) => {
          setpaginationMng({ current: page, pageSize: pageSize });
          setapiIntercepter(!apiIntercepter);
        }}
      />
    </Container>
  );
};
