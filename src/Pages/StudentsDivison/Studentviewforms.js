import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { Descriptions, Result, Spin, Table, Typography, message } from "antd";
import styled from "styled-components";
import {
  refineData,
  tableFilterListConverter,
  toObjectToPara,
} from "../../GenericComponents/Modifiers";
const Container = styled.div`
  & .ant-descriptions-title {
    text-align: center;
  }
`;

export const Studentviewforms = () => {
  const { usertoken } = useParams();
  const [userdata, setUserdata] = useState({});
  const [descriptionData, setDescriptionData] = useState({
    descriptionData: [],
    extracted: [],
    filtersList: { classList: ["NA"], subjectList: ["NA"] },
  });
  const [headerChangeResponsive, setheaderChangeResponsive] = useState(true);
  const [response, setresponse] = useState({ isLoaded: true, isError: false });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const onFeedetailExpand = (prop) => {
    let x = Object.entries(prop).filter(
      (i) => i[0] !== "id" && i[0] !== "paidAmount"
    );
    if (576 <= windowSize.width && windowSize.width < 768) {
      x = x.filter((i) => i[0] !== "dateOfPaid");
    } else if (767 < windowSize.width && windowSize.width < 992) {
      x = x.filter((i) => i[0] !== "dateOfPaid" && i[0] !== "subjectsTaken");
    }
    return toObjectToPara(x);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const apiCall = async () => {
      await axiosInstance
        .get(API.STUDENT_BY_ID + usertoken)
        .then((result) => {
          // console.log(result.data);
          // console.log(refineData(result.data));
          // let refine = refineData(result.data);
          // console.log(refine.extracted.feeDetails);
          setUserdata(result.data);
          setDescriptionData(refineData(result.data));
          setresponse({ isLoaded: false, isError: false });
        })
        .catch((err) => {
          console.log(err);
          message.error("Server Issue");
          setresponse({ isLoaded: false, isError: true });
        });
    };

    apiCall();
    setheaderChangeResponsive(windowSize.width < 992);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  let secondaryContainer = {
    marginTop: "15px",
    // border: "1px solid red",
    padding: "10px",
    height: "calc(100vh - 185px)",
    overflowY: "auto",
  };

  const feedetailsColumn = [
    {
      title: "Trans ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 100,
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: "Subjects",
      dataIndex: "subjectsTaken",
      key: "subjectsTaken",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Date",
      dataIndex: "dateOfPaid",
      key: "dateOfPaid",
      responsive: ["sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: "Month Fee",
      dataIndex: "feeCharge",
      key: "feeCharge",
      responsive: ["lg", "xl", "xxl"],
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      responsive: ["xs", "sm", "md", "lg", "xl", "xxl"],
    },
  ];
  const subjectstatisticColumn = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Test Date",
      dataIndex: "dateOfTest",
      key: "dateOfTest",
      responsive: ["sm", "md", "lg", "xl", "xxl"],
    },
    {
      title: "Class No",
      dataIndex: "classNo",
      key: "classNo",
      filters: tableFilterListConverter(descriptionData.filtersList.classList),
      onFilter: (value, record) => record.classNo.includes(value),
      // responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      filters: tableFilterListConverter(
        descriptionData.filtersList.subjectList
      ),
      onFilter: (value, record) => record.subjectList.includes(value),
    },
    {
      title: "Marks",
      render: (_, rec) => {
        return (
          <Typography.Text>
            {String(rec.scoredMarks)}/{String(rec.maxMarks)}
          </Typography.Text>
        );
      },
    },
  ];

  return (
    <Container>
      <Backnavigationbtn title="Student Details" />
      {response.isError ? (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
        />
      ) : (
        <div style={secondaryContainer}>
          <Spin spinning={response.isLoaded}>
            <Descriptions
              title={
                <Typography.Title
                  level={4}
                  style={{ textAlign: "center", margin: " 0px" }}
                >
                  {userdata.name}
                </Typography.Title>
              }
              bordered
              column={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 4,
              }}
              items={descriptionData.descriptionData}
            />
            <Typography.Title level={4} style={{ textAlign: "center" }}>
              Fee Deatils
            </Typography.Title>
            <Table
              columns={feedetailsColumn}
              dataSource={descriptionData.extracted.feeDetails}
              pagination={false}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <Typography.Paragraph style={{ textAlign: "center" }}>
                    {onFeedetailExpand(record)}
                  </Typography.Paragraph>
                ),

                showExpandColumn: headerChangeResponsive,
              }}
            />

            <Typography.Title level={4} style={{ textAlign: "center" }}>
              Subject Statistics
            </Typography.Title>
            <Table
              columns={subjectstatisticColumn}
              dataSource={descriptionData.extracted.subjectStatistics}
              pagination={false}
              rowKey="id"
            />
          </Spin>
        </div>
      )}
    </Container>
  );
};
