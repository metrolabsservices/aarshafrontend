import {
  CreditCardOutlined,
  SearchOutlined,
  SyncOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Input, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Studenttable } from "./Studenttable";

const Container = styled.div`
  height: 100%;

  & .ant-card > .ant-card-body {
    padding: 0%;
  }
  & .navIcons {
    background-color: #e9ffe6;
  }
  & .ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: #14b10b;
    border-color: #14b10b;
    background-color: white;
  }
`;

export const Studentindex = () => {
  const [searchValue, setSearchValue] = useState({
    inputValue: "",
    filterReset: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [channels, setChannels] = useState({
    mobileView: false,
    tabletView: false,
    laptopView: false,
    desktopView: false,
  });
  const headerNavigation = {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    border: "0px",
    padding: channels.mobileView ? "10px" : "25px",
    height: "100%",
  };

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
    if (searchInput.length > 2) {
      setSearchValue({ ...searchValue, inputValue: searchInput });
    }
  }, [searchInput]);
  // console.log(channels);
  let breakPointSetup = {
    size: channels.desktopView || channels.laptopView ? "large" : "middle",
    shape: "circle",
  };
  const filterResetHandler = (i) => {
    setSearchValue({ ...searchValue, filterReset: i });
  };

  return (
    <Container>
      <Card style={headerNavigation}>
        <Flex justify="space-around" align="center" wrap="wrap" gap="small">
          <Space.Compact {...breakPointSetup}>
            <Input
              name="searchByName"
              placeholder="search by name"
              onChange={(e) => setSearchInput(e.target.value)}
              suffix={<SearchOutlined />}
              value={searchInput}
            />
            <Button
              type="primary"
              onClick={() => {
                setSearchInput("");
                setSearchValue({ ...searchValue, inputValue: "" });
              }}
            >
              Reset
            </Button>
          </Space.Compact>
          <Button
            className="navIcons"
            {...breakPointSetup}
            icon={<SyncOutlined />}
            onClick={() => {
              setSearchValue({ inputValue: "", filterReset: true });
              setSearchInput("");
            }}
          />
          <Button
            className="navIcons"
            {...breakPointSetup}
            // onClick={()=> }
            icon={<UserAddOutlined />}
          />
          <Button
            className="navIcons"
            {...breakPointSetup}
            icon={<CreditCardOutlined />}
          />
        </Flex>
        <Studenttable
          searchFilter={searchValue}
          isFilterReset={(index) => filterResetHandler(index)}
        />
      </Card>
    </Container>
  );
};
