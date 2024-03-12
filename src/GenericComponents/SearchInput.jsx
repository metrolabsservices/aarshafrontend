import {
  FileAddOutlined,
  PlusCircleTwoTone,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Input,
  Layout,
  List,
  Popover,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../services/axiosInstance";
import { API } from "../services/api.constants";
import { toCaptalizeString } from "./Modifiers";
import { Backnavigationbtn } from "./Backnavigationbtn";

const Container = styled.div`
  & .ant-card .ant-card-meta-detail > div:not(:last-child) {
    margin-bottom: 0;
  }
  & .ant-card .ant-card-head {
    font-size: smaller;
    font-weight: lighter;
  }
  & .selectorBox {
    margin: 5px;
    position: sticky;
  }
  & .secondaryContainer {
    max-height: 390px;
    overflow-y: auto;
  }
`;

export const SearchInput = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [channels, setChannels] = useState({
    mobileView: true,
    tabletView: false,
    laptopView: false,
    desktopView: false,
  });
  const [widthAdj, setwidthAdj] = useState(570);
  const [data, setData] = useState([]);
  const [errorRaised, seterrorRaised] = useState(false);
  const [openStatus, setopenStatus] = useState(true);
  const [descriptionDisplayStatus, setDescriptionDisplayStatus] = useState({
    status: true,
    desData: [],
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      const w = window.innerWidth;
      setChannels({
        mobileView: w <= 576,
        tabletView: 577 <= w && w <= 992,
        laptopView: 993 <= w && w <= 1200,
        desktopView: w > 1201,
      });
      setwidthAdj(w);
    };
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    const apiCall = async () => {
      await axiosInstance
        .post(API.STUDENT_BY_NAME, { searchIput: searchValue })
        .then((result) => {
          setData(result.data);
          seterrorRaised(false);
        })
        .catch((err) => {
          console.log(err);
          seterrorRaised(true);
        });
    };
    apiCall();
    setopenStatus(!(searchValue.length > 0));
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, [searchValue]);
  const itemDisplay = (prp) => {
    let x = Object.entries(prp)
      .filter((j) => j[0] != "feeDetails")
      .map((i) => ({ label: toCaptalizeString(i[0]), children: String(i[1]) }));
    console.log(prp, x);

    setSearchValue("");
    setopenStatus(true);
    setDescriptionDisplayStatus({ desData: x, status: false });
  };
  return (
    <Container>
      <Flex justify="space-evenly" align="center" className="selectorBox">
        <Backnavigationbtn />
        <Space.Compact>
          <Input
            suffix={<SearchOutlined />}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <Button
            type="primary"
            onClick={() => {
              setData([]);
              setSearchValue("");
              setDescriptionDisplayStatus({
                status: true,
                desData: [],
              });
            }}
          >
            Reset
          </Button>
        </Space.Compact>
      </Flex>
      <div className="secondaryContainer">
        <div
          hidden={openStatus}
          style={{
            marginTop: 20,
            border: "2px solid grey",
            padding: "0px 5px",
          }}
        >
          {errorRaised ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description={
                <span>
                  Data <a href="#API">Not Found</a>
                </span>
              }
            />
          ) : (
            <List
              dataSource={data}
              style={{
                overflowX: "scroll",
                maxHeight: "150px",
              }}
              renderItem={(e) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${e.name}`}
                    description={`S/O ${e.guardianName}, Phn No-${e.guardianPhoneNumber}`}
                  />
                  <Button
                    icon={<PlusCircleTwoTone twoToneColor="#ff2222" />}
                    type="text"
                    onClick={() => itemDisplay(e)}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
        <div hidden={descriptionDisplayStatus.status} style={{ marginTop: 20 }}>
          <Descriptions
            title="Student Details Checked"
            bordered
            size="small"
            column={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            items={descriptionDisplayStatus.desData}
          />
        </div>
        <Layout style={{ marginTop: 30 }}>
          <Layout.Content>
            <Card
              title={
                <Card.Meta
                  title="AARSHA TUTIONS"
                  description="learning is timeless"
                />
              }
              extra={<Avatar src="/logo512.png" alt="LOGO" />}
            >
              <Descriptions
                title="Student Details Checked"
                size="small"
                column={{
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 4,
                  xxl: 4,
                }}
                items={descriptionDisplayStatus.desData}
              />
            </Card>
          </Layout.Content>
          <Layout.Footer>
            <Button type="primary" style={{ width: "100%" }}>
              Submit
            </Button>
          </Layout.Footer>
        </Layout>
      </div>
    </Container>
  );
};
