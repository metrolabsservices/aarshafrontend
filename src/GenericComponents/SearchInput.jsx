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
    margin-top: 25px;
    width: 100%;
    position: sticky;
  }
  & .secondaryContainer {
    max-height: 390px;
    overflow-y: auto;
  }
`;

export const SearchInput = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [data, setData] = useState();
  const [errorRaised, setErrorRaised] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      // console.log(window.innerWidth, window.innerHeight);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    const apiCall = async (searchValue) => {
      await axiosInstance
        .post(API.STUDENT_BY_NAME, { searchIput: searchValue })
        .then((result) => {
          setData(result.data);
          setErrorRaised(false);
        })
        .catch((err) => {
          console.log(err);
          setErrorRaised(true);
        });
    };

    apiCall();
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      <Space.Compact className="selectorBox">
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
          }}
        >
          Reset
        </Button>
      </Space.Compact>
    </Container>
  );
};
