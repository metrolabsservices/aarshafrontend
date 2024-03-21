import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import { API } from "../../services/api.constants";
import axiosInstance from "../../services/axiosInstance";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Input,
  Pagination,
  Result,
  Row,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  toDateConverter,
  toSortByDate,
} from "../../GenericComponents/Modifiers";
import { Titlecustom } from "../../GenericComponents/Titlecustom";
import { PieChartRep } from "../../GenericComponents/PieChartRep";
import { FeeDrawerAdj } from "../../GenericComponents/FeeDrawerAdj";

const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  height: 100%;
  & .statBtn {
    border-radius: 50%;
    border-color: #a020f0;
    color: #a020f0;
  }
  & .searchBar {
    margin-top: "20px";
  }
`;

export const StudentInfo = () => {
  const [dataSource, setDataSource] = useState({});

  const [searchValue, setsearchValue] = useState({
    value: "",
    isError: false,
    apiFilterData: [],
  });

  const [paginationMng, setpaginationMng] = useState({
    current: 1,
    pageSize: 5,
  });

  const [drawerData, setdrawerData] = useState([]);

  const [bolMng, setBolMng] = useState({
    isError: false,
    isLoaded: true,
    isDrawerOpen: false,
    isCalled: false,
    isfirstSearched: true,
  });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const feedetailsDisplay = (props) => {
    console.log(props);
    setdrawerData({
      ...props,
      feeCharge: toSortByDate(props.feeCharge),
      feeDetails: toSortByDate(props.feeDetails),
    });
    setBolMng({ ...bolMng, isDrawerOpen: true });
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Student Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Parent Name",
      key: "parentName",
      dataIndex: "parentName",
    },
    {
      title: "Statistics",
      key: "operation",
      width: 90,
      render: (_, data) => {
        return (
          <Container>
            <Button
              icon={<BarChartOutlined />}
              className="statBtn"
              onClick={() => feedetailsDisplay(data)}
            />
          </Container>
        );
      },
    },
  ];

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const onSearch = (prop) => {
    if (prop.length > 0 && /^[a-zA-Z]+$/.test(prop) && bolMng.isfirstSearched) {
      setpaginationMng({
        current: 1,
        pageSize: 5,
      });
      setBolMng({ ...bolMng, isfirstSearched: false });
    }
    setsearchValue({
      value: prop,
      isError: !/^[a-zA-Z]*$/.test(prop),
      apiFilterData:
        !/^[a-zA-Z]*$/.test(prop) || prop === ""
          ? []
          : [
              { key: "name", value: prop, operation: "combinedSearch" },
              { key: "parentName", value: prop, operation: "combinedSearch" },
            ],
    });
    setBolMng({ ...bolMng, isCalled: !bolMng.isCalled });
  };

  if (searchValue.isError) {
    message.error("try to search names only");
  }
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const apiCall = async (pr) => {
      await axiosInstance
        .get(API.STUDENY_BY_FEE, pr)
        .then((result) => {
          console.log(result.data);
          setDataSource(result.data);
          setBolMng({ ...bolMng, isLoaded: false, isError: false });
        })
        .catch((err) => {
          console.log(
            "error message in server side table ",
            err.response.data.ErrorMessage
          );
          setBolMng({ ...bolMng, isLoaded: false, isError: true });
        });
    };
    const params = {
      params: {
        Filters: searchValue.apiFilterData,
        PageData: paginationMng,
      },
    };
    apiCall(params);
  }, [bolMng.isCalled]);

  return (
    <Container>
      <Backnavigationbtn title={"Students Information"} />
      <div className="mainContainer">
        {bolMng.isError ? (
          <Result
            status="warning"
            title="Backend Issue Raised"
            className="errorProp"
          />
        ) : (
          <Spin spinning={bolMng.isLoaded}>
            <Space direction="vertical" align="center">
              <Space.Compact style={{ marginTop: 20 }}>
                <Input
                  suffix={<SearchOutlined />}
                  placeholder="Search by name only"
                  value={searchValue.value}
                  onChange={(e) => onSearch(e.target.value)}
                  status={searchValue.isError ? "error" : ""}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setsearchValue({
                      value: "",
                      isError: false,
                      apiFilterData: [],
                    });
                    setpaginationMng({
                      current: 1,
                      pageSize: 5,
                    });
                    setBolMng({ ...bolMng, isCalled: !bolMng.isCalled });
                  }}
                >
                  Reset
                </Button>
              </Space.Compact>
              <Table
                columns={columns}
                dataSource={dataSource.items}
                scroll={{ x: 50, y: 320 }}
                pagination={false}
              />
              <Pagination
                defaultCurrent={1}
                defaultPageSize={5}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                {...paginationMng} // current={} pageSize={}
                total={dataSource.totalCount}
                onChange={(page, pageSize) => {
                  setpaginationMng({ current: page, pageSize: pageSize });
                  setBolMng({ ...bolMng, isCalled: !bolMng.isCalled });
                }}
              />
            </Space>
          </Spin>
        )}
      </div>
      <Drawer
        title={
          drawerData?.name
            ? `Fee details of ${drawerData.name.toUpperCase()}`
            : "Fee Details"
        }
        placement="right"
        size="large"
        onClose={() => setBolMng({ ...bolMng, isDrawerOpen: false })}
        open={bolMng.isDrawerOpen}
        extra={
          <Space>
            <Button
              type="primary"
              onClick={() => setBolMng({ ...bolMng, isDrawerOpen: false })}
            >
              OK
            </Button>
          </Space>
        }
      >
        <FeeDrawerAdj data={drawerData} />
      </Drawer>
    </Container>
  );
};
