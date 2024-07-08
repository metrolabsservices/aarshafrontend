import {
  Badge,
  Flex,
  FloatButton,
  Modal,
  Pagination,
  Popconfirm,
  Result,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "./../../services/axiosInstance";
import { API } from "../../services/api.constants";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  DeleteTwoTone,
  EditOutlined,
  EditTwoTone,
  EyeOutlined,
  EyeTwoTone,
  FileProtectOutlined,
  FilterTwoTone,
} from "@ant-design/icons";
import { FilterBlock } from "../../GenericComponents/FilterBlock";
import { optionMasterTypes } from "../../GenericComponents/OptionsMasterRecord";
import { useGuard } from "../../dbHub/GuardContext";

const Container = styled.div`
  /* height: calc(100vh - ); */
  align-items: center;
  align-content: center;
  // border: 1px solid red;
  & .paginationProp {
    /* margin-top: 20; */
    /* background-color: #a020f0; */
    text-align: right;
  }
`;

export const Studenttable = ({ props, outFunc }) => {
  const { dbInfo } = useGuard();
  const initialPagination = {
    pageSize: 4,
    current: 1,
  };
  const styless = { style: { height: "100%" } };
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [filterData, setFilterData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [filterBlockReset, setfilterBlockReset] = useState(false);
  const [apiIntercept, setApiIntercept] = useState(false);
  const [paginationProps, setpaginationProps] = useState(initialPagination);
  const [paginationCalling, setPaginationCalling] = useState(true);
  const [errorHandler, seterrorHandler] = useState({
    isError: false,
    errorMessage: "",
  });
  const [isLoaded, setisLoaded] = useState(true);

  const itemDelete = async (id) => {
    await axiosInstance
      .put(API.STUDENT_BY_ID + String(id), { isDeleted: true })
      .then((result) => {
        message.success("Record Deleted Successfully");
        setApiIntercept(!apiIntercept);
      })
      .catch((err) => {
        message.error("Failed to Delete ");
      });
  };

  useEffect(() => {
    const handleResize = () => {
      // console.log(
      //   "Windows Height and Width --->  ",
      //   window.innerWidth,
      //   window.innerHeight
      // );
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const apiCall = async (flt, pgn) => {
      // console.log(flt, pgn);
      await axiosInstance
        .get(API.STUDENT_BY_ALL, {
          params: {
            Filters: flt,
            Pagination: pgn,
          },
        })
        .then((result) => {
          console.log("api called data --> ", result);
          !dbInfo.isSelectorReady
            ? seterrorHandler({
                isError: true,
                errorMessage: "Unable to get Selectors - Backend Failed",
              })
            : seterrorHandler({
                isError: false,
                errorMessage: "",
              });
          setTableData(result.data);
          setisLoaded(false);
        })
        .catch((err) => {
          // console.log("api error resp --> ", err);
          seterrorHandler({
            isError: true,
            errorMessage: "Unable to get Table Data - Backend Failed",
          });
          setisLoaded(false);
        });
    };

    let searchSet = [];
    if (!props.isSearchReset) {
      searchSet = [
        {
          operation: "containsCombined",
          key: "name",
          value: props.searchValue,
        },
        {
          operation: "containsCombined",
          key: "parentName",
          value: props.searchValue,
        },
        {
          operation: "containsCombined",
          key: "parentPhnNo",
          value: props.searchValue,
        },
      ];
    }

    let filterSet = [{ key: "isDeleted", value: false, operation: "delete" }];

    if (props.isTotalReset) {
      console.log("---------- Reset is in Table ---------");
      setFilterData({});
      setfilterBlockReset(true);
      setpaginationProps(initialPagination);
      outFunc({ ...props, isTotalReset: false });
    } else {
      filterSet = [
        ...searchSet,
        ...Object.values(filterData),
        { key: "isDeleted", value: false, operation: "delete" },
      ];
    }

    if (!props.isSearchReset && paginationCalling) {
      setpaginationProps(initialPagination);
      setPaginationCalling(!paginationCalling);
    }
    // console.log("nav Props -- > ", props);
    // console.log("selectors Filters -- > ", filterData);
    // console.log("final Filter Result -- > ", filterSet);

    window.addEventListener("resize", handleResize);
    const timeOut = setTimeout(() => {
      apiCall(filterSet, paginationProps);
    }, 100);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeOut);
    };
  }, [props, dbInfo, apiIntercept, paginationCalling]);

  const TableFormOutput = (e) => {
    // console.log("filter Data -- > ", e);
    if (e?.reset) {
      let removeResetObject = { ...filterData };
      delete removeResetObject[e.reset];
      console.log(removeResetObject);
      setFilterData(removeResetObject);
    } else {
      const x = { ...filterData, ...e };
      setFilterData(x);
    }
    setApiIntercept(!apiIntercept);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["lg", "xl", "xxl"],
      width: 50,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 100,
    },
    {
      title: "Board",
      dataIndex: "boardType",
      key: "boardType",
      width: 80,
      filterDropdown: ({ close }) => {
        return (
          <FilterBlock
            onClose={() => close()}
            type="multiSelector"
            options={dbInfo.selectors.boardTypes}
            mainKey="boardType"
            tableOutput={TableFormOutput}
            isReset={filterBlockReset}
          />
        );
      },
      filterIcon: () => (
        <FilterTwoTone
          twoToneColor={filterData.boardType ? "#00b96b" : "#b1b1b1"}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "studentStatus",
      key: "studentStatus",
      width: 100,
      // filterDropdown: ({ close }) => {
      //   return (
      //     <FilterBlock
      //       onClose={() => close()}
      //       type="multiSelector"
      //       mainKey="studentStatus"
      //       options={optionMasterTypes.studentStatusTypes}
      //       tableOutput={TableFormOutput}
      //     />
      //   );
      // },
      // filterIcon: () => (
      //   <FilterTwoTone
      //     twoToneColor={filterData?.studentStatus ? "#00b96b" : "#b1b1b1"}
      //   />
      // ),
      render: (_, record) => (
        <Tag
          bordered={false}
          color={
            record.studentStatus === "inactive"
              ? "error"
              : record.studentStatus === "active"
              ? "success"
              : "red"
          }
        >
          {record.studentStatus}
        </Tag>
      ),
    },
    {
      title: "Guard Name",
      dataIndex: "parentName",
      key: "parentName",
      width: 100,
    },
    {
      title: "Phone",
      dataIndex: "parentPhnNo",
      key: "parentPhnNo",
      width: 100,
    },
    {
      title: "Class",
      dataIndex: "classNo",
      key: "classNo",
      width: 80,
      // filterDropdown: ({ close }) => {
      //   return (
      //     <FilterBlock
      //       onClose={() => close()}
      //       type="searchSelector"
      //       options={optionMasterTypes.gradeTypes}
      //       mainKey="classNo"
      //       tableOutput={TableFormOutput}
      //     />
      //   );
      // },
      // filterIcon: () => (
      //   <FilterTwoTone
      //     twoToneColor={filterData?.classNo ? "#00b96b" : "#b1b1b1"}
      //   />
      // ),
    },
    {
      title: "Action",
      key: "action",
      width: 75,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" wrap>
          <Link key={"edit"} to={`/main/studentpage/editstudent/${record.id}`}>
            <EditTwoTone />
          </Link>
          <Link key={"view"} to={`/main/studentpage/viewstudent/${record.id}`}>
            <EyeTwoTone />
          </Link>
          <Popconfirm
            title="are u sure ?"
            onConfirm={() => itemDelete(record.id)}
          >
            <DeleteTwoTone />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Container
      style={{
        height:
          windowsSize.width < 577
            ? "calc(100vh - 250px)"
            : "calc(100vh - 195px)",
      }}
    >
      {errorHandler.isError ? (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Result
            className="errorBox"
            status="warning"
            title="Sorry, something went wrong"
            subTitle={errorHandler.errorMessage}
          />
        </Flex>
      ) : (
        <Spin spinning={isLoaded} style={{ height: "100%" }}>
          <Table
            columns={columns}
            dataSource={tableData.items}
            rowKey="id"
            bordered
            size="small"
            // size={
            //   channels.mobileView || channels.tabletView
            //     ? "small"
            //     : channels.desktopView
            //     ? "large"
            //     : "middle"
            // }
            scroll={{ x: 50, y: 220 }}
            pagination={false}
          />
          <Pagination
            className="paginationProp"
            style={{ marginTop: "15px" }}
            size="small"
            defaultCurrent={1}
            defaultPageSize={4}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            {...paginationProps} // current={} pageSize={}
            total={tableData.totalCount}
            showTotal={() => `Total ${tableData.totalCount}`}
            onChange={(page, pageSize) => {
              setpaginationProps({ current: page, pageSize: pageSize });
              setApiIntercept(!apiIntercept);
            }}
          />
        </Spin>
      )}
    </Container>
  );
};
