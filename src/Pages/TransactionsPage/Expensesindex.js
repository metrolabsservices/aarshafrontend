import {
  BarChartOutlined,
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  FilterTwoTone,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Input,
  Pagination,
  Popconfirm,
  Result,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { NavBtn } from "../../GenericComponents/NavBtn";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { toDateConverter } from "../../GenericComponents/Modifiers";
import { useNavigate } from "react-router-dom";
import { useGuard } from "../../dbHub/GuardContext";
import { TransactionChartsBlock } from "../../GenericComponents/TransactionChartsBlock";
import styled from "styled-components";
import { CustomSelectorsList } from "../../GenericComponents/SelectorsApi";
import { FilterBlock } from "../../GenericComponents/FilterBlock";

const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  /* height: 100vh; */
  overflow: hidden;
  & .navContainer {
    background-color: blueviolet;
    height: auto;
  }
  & .btnsSec {
    width: 100%;
    background-color: whitesmoke;
    padding: 20px 10px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  & .secondBlock {
    overflow-y: scroll;
    height: calc(100vh - 220px);
  }
`;

export const Expensesindex = () => {
  const { dbInfo } = useGuard();
  const navigate = useNavigate();
  const initialPagination = {
    current: 1,
    pageSize: 3,
  };
  const [dataSource, setDataSource] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState({});
  const [apiIntercepter, setapiIntercepter] = useState(false);
  const [selectorsList, setselectorsList] = useState({});
  const [filterBlockReset, setfilterBlockReset] = useState(false);
  const [resultHandler, setResultHandler] = useState({
    isLoaded: true,
    isError: false,
    errorMessage: "",
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [paginationMng, setpaginationMng] = useState(initialPagination);

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    const selectorSemiApi = async () => {
      const mySelectors = await CustomSelectorsList();
      if (mySelectors.response) {
        setselectorsList(mySelectors.data);
        setResultHandler({
          isLoaded: false,
          isError: false,
          errorMessage: "",
        });
      } else {
        setResultHandler({
          isLoaded: false,
          isError: true,
          errorMessage: "Unable to get Selectors - Backend Failed",
        });
      }
    };
    const apiCall = async (Filters, PageData) => {
      // console.log(Filters, PageData);
      await axiosInstance
        .get(API.TRANSACTION_BY_ALL, {
          params: {
            Pagination: PageData,
            Filters: Filters,
          },
        })
        .then((result) => {
          setDataSource(result.data);
          selectorSemiApi();

          // console.log("API result =---- ", result.data);
        })
        .catch((err) => {
          // console.log("API Error ----------", err);
          setResultHandler({
            isLoaded: false,
            isError: true,
            errorMessage: "Unable to get Table Data - Backend Failed",
          });
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

    setpaginationMng(initialPagination);
    setSearchData({});
  };

  const itemDelete = async (id) => {
    const pack = { isDeleted: "true" };
    await axiosInstance
      .delete(API.TRANSACTION_SOFT_DELETE + id)
      .then((result) => {
        message.success("Record Deleted Successfully");
        setapiIntercepter(!apiIntercepter);
      })
      .catch((err) => {
        message.error("Failed to Delete ");
      });
  };

  const TableFormOutput = (e) => {};

  const ButtonsList = [
    {
      label: "Add Trnx",
      icon: <PlusOutlined />,
      routeLink: "/main/transactionspage/addtrx/add",
      isDisabled: false,
    },
    {
      label: "Reset",
      icon: <SyncOutlined />,
      routeLink: "/main/transactionspage/addtrx/add",
      isDisabled: true,
    },
    {
      label: " Trnx Reports",
      icon: <BarChartOutlined />,
      routeLink: "/main/transactionspage/trxchartspage",
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
      width: 200,
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
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (rec, _) => `₹ ${rec} /- `,
    },
    {
      title: "Payement",
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      width: 130,
    },
    {
      title: "Mode",
      dataIndex: "transactionMode",
      key: "transactionMode",
      width: 100,
      render: (_, record) => (
        <Tag
          bordered={false}
          color={record.transactionMode === "Debit" ? "error" : "success"}
        >
          {record.transactionMode}
        </Tag>
      ),

      filterDropdown: ({ close }) => {
        return (
          <FilterBlock
            onClose={() => close()}
            type="multiSelector"
            options={selectorsList.transactionMode}
            mainKey="transactionMode"
            tableOutput={TableFormOutput}
            isReset={filterBlockReset}
          />
        );
      },
      filterIcon: () => <FilterTwoTone />,
    },
    {
      title: "Action",
      key: "action",
      width: 95,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" wrap>
          <EditTwoTone
            onClick={() =>
              navigate(`/main/transactionspage/trxedit/${record.id}/edit`)
            }
          />
          <EyeTwoTone
            onClick={() =>
              navigate(`/main/transactionspage/trxedit/${record.id}/view`)
            }
          />
          <div hidden={false}>
            <Popconfirm
              title="are u sure ?"
              onConfirm={() => itemDelete(record.id)}
            >
              <DeleteTwoTone />
            </Popconfirm>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <Container>
      {resultHandler.isError ? (
        <Flex
          justify="center"
          align="center"
          style={{ height: "calc(100vh - 150px)" }}
        >
          <Result
            className="errorBox"
            status="warning"
            title="Sorry, something went wrong"
            subTitle={resultHandler.errorMessage}
          />
        </Flex>
      ) : (
        <Spin spinning={resultHandler.isLoaded}>
          <Row gutter={[5, 15]} wrap className="btnsSec">
            {ButtonsList.map((i) => (
              <Col
                span={windowSize.width < 768 ? 12 : 4}
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
          <Row gutter={[0, 10]} className="secondBlock">
            <Col span={24} style={{ textAlign: "end" }}>
              <Pagination
                defaultCurrent={1}
                defaultPageSize={3}
                pageSizeOptions={[3, 5, 10, 20, 50, 100]}
                {...paginationMng} // current={} pageSize={}
                total={dataSource.totalCount}
                // size="small"
                onChange={(page, pageSize) => {
                  setpaginationMng({ current: page, pageSize: pageSize });
                  setapiIntercepter(!apiIntercepter);
                }}
              />
            </Col>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={dataSource.items}
                scroll={{ x: 50, y: 320 }}
                pagination={false}
                bordered
                size="small"
              />
            </Col>

            <Col span={24}>
              <TransactionChartsBlock />
            </Col>
          </Row>
        </Spin>
      )}
    </Container>
  );
};
