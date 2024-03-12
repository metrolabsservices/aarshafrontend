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
  FilterTwoTone,
} from "@ant-design/icons";
import { FilterBlock } from "../../GenericComponents/FilterBlock";
import { optionMasterTypes } from "../../GenericComponents/OptionsMasterRecord";

const Container = styled.div`
  width: auto;

  margin-top: 15px;
  & .errorBox {
    padding: 0%;
  }
`;

export const Studenttable = ({ searchFilter, isFilterReset }) => {
  var initialPage = {
    current: 1,
    pageSize: 5,
  };

  const [channels, setChannels] = useState({
    mobileView: false,
    tabletView: false,
    laptopView: false,
    desktopView: false,
  });

  const [dataSource, setdataSource] = useState([]);
  const [filterFormData, setfilterFormData] = useState({});
  const [totalFormBlockReset, setTotalFormBlockReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpin, setIsSpin] = useState(true);
  const [onCalling, setonCalling] = useState(false);
  const [paginationReset, setPaginationReset] = useState(false);
  const [paginationProp, setPaginationProp] = useState(initialPage);

  const TableFormOutput = (e) => {
    if (e?.reset) {
      let removeResetObject = { ...filterFormData };
      delete removeResetObject[e.reset];
      // console.log(removeResetObject);
      setfilterFormData(removeResetObject);
    } else {
      setfilterFormData({ ...filterFormData, ...e });
    }
  };

  const onChangeHandle = (pagination, filters, sorter) => {
    console.log(sorter, pagination);
    if (pagination) {
      setPaginationProp({ ...paginationProp, ...pagination });
    }
  };

  const itemDelete = async (id) => {
    await axiosInstance
      .put(API.STUDENT_BY_ID + String(id), { isDeleted: true })
      .then((result) => {
        message.success("Record Deleted Successfully");
        setonCalling(!onCalling);
      })
      .catch((err) => {
        message.error("Failed to Delete ");
      });
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
            options={optionMasterTypes.boardTypes}
            mainKey="boardType"
            tableOutput={TableFormOutput}
            isReset={totalFormBlockReset}
          />
        );
      },
      filterIcon: () => (
        <FilterTwoTone
          twoToneColor={filterFormData?.boardType ? "#00b96b" : "#b1b1b1"}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "studentStatus",
      key: "studentStatus",
      width: 100,
      filterDropdown: ({ close }) => {
        return (
          <FilterBlock
            onClose={() => close()}
            type="multiSelector"
            mainKey="studentStatus"
            options={optionMasterTypes.studentStatusTypes}
            tableOutput={TableFormOutput}
          />
        );
      },
      filterIcon: () => (
        <FilterTwoTone
          twoToneColor={filterFormData?.studentStatus ? "#00b96b" : "#b1b1b1"}
        />
      ),
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
      filterDropdown: ({ close }) => {
        return (
          <FilterBlock
            onClose={() => close()}
            type="searchSelector"
            options={optionMasterTypes.gradeTypes}
            mainKey="classNo"
            tableOutput={TableFormOutput}
          />
        );
      },
      filterIcon: () => (
        <FilterTwoTone
          twoToneColor={filterFormData?.classNo ? "#00b96b" : "#b1b1b1"}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 75,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" wrap>
          <Link key={"edit"} to={`/Home_B/editstudent/${record.id}`}>
            <EditTwoTone />
          </Link>
          <Link key={"view"} to={`/Home_B/viewstudent/${record.id}`}>
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

  useEffect(() => {
    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      setChannels({
        mobileView: w <= 576,
        tabletView: 577 <= w && w <= 992,
        laptopView: 993 <= w && w <= 1200,
        desktopView: w > 1201,
      });
    });
    const apiCall = async () => {
      await axiosInstance
        .get(API.STUDENT_BY_ALL, {
          params: {
            Filters: onFilterUpdated,
            Pagination: paginationProp,
          },
        })
        .then((result) => {
          // console.log(result.data);

          setdataSource(result.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(
            "error message in server side table ",
            err.response.data.ErrorMessage
          );
          setIsLoading(true);
        })
        .finally(() => {
          setIsSpin(false);
        });
    };

    let searchFinalValues =
      searchFilter.inputValue === ""
        ? []
        : [
            {
              operation: "containsCombined",
              key: "name",
              value: searchFilter.inputValue,
            },
            {
              operation: "containsCombined",
              key: "guardianName",
              value: searchFilter.inputValue,
            },
            {
              operation: "containsCombined",
              key: "guardianPhoneNumber",
              value: searchFilter.inputValue,
            },
          ];

    if (searchFilter.filterReset) {
      setfilterFormData({});
      isFilterReset(!searchFilter.filterReset);
    }

    let onFilterUpdated = [
      ...searchFinalValues,
      ...Object.values(filterFormData),
      { key: "isDeleted", value: false, operation: "delete" },
    ];
    // if (onFilterUpdated.length > 0 && paginationReset === false) {
    //   console.log("Pagination setup");
    //   setPaginationProp(initialPage);
    //   setPaginationReset(true);
    // }

    console.log(onFilterUpdated, "filter search value");

    apiCall();
  }, [
    paginationProp,
    onCalling,
    searchFilter,
    filterFormData,
    paginationReset,
  ]);

  const tableStyling = {
    height: "calc(100vh - 210px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: channels.mobileView ? "center" : "start",
  };

  return (
    <Container>
      {isLoading ? (
        <Flex align="center" justify="center" vertical={true}>
          <Result
            className="errorBox"
            status="500"
            subTitle="Sorry, something went wrong."
          />
        </Flex>
      ) : (
        <div style={tableStyling}>
          <Spin spinning={isSpin}>
            <Table
              columns={columns}
              dataSource={dataSource.items}
              rowKey="id"
              bordered
              size={
                channels.mobileView || channels.tabletView
                  ? "small"
                  : channels.desktopView
                  ? "large"
                  : "middle"
              }
              scroll={{ x: 50, y: 220 }}
              pagination={{
                ...paginationProp,
                total: dataSource.totalCount,
                pageSizeOptions: [5, 10, 25, 50, 100],
                position: ["bottomRight"],
                size: "small",
              }}
              onChange={onChangeHandle}
            />
          </Spin>
        </div>
      )}
    </Container>
  );
};
