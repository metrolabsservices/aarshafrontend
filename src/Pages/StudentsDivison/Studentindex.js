import {
  CreditCardOutlined,
  SearchOutlined,
  SyncOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Input, Row, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Studenttable } from "./Studenttable";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  & .navIcons {
    background-color: #e9ffe6;
  }
  & .ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
    color: #14b10b;
    border-color: #14b10b;
    background-color: white;
  }
  & .navBarProp {
    margin: 20px 0px 35px 0px;
  }
`;

export const Studentindex = () => {
  const nav = useNavigate();
  const [windowsSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [childProp, setChildProp] = useState({
    searchValue: "",
    isSearchReset: true,
    isTotalReset: false,
  });

  const headerNavigation = {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    border: "0px",
    height: "100%",
    padding: "5px",
  };

  const studentTableOpt = (e) => {
    setChildProp(e);
    // console.log("--------- student index", e);
  };

  useEffect(() => {
    const handleResize = () => {
      // console.log(window.innerWidth, window.innerHeight);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let breakPointSetup = {
    size: windowsSize.width < 577 ? "middle" : "large",
    shape: "circle",
  };

  let navBarStyles = {
    margin: windowsSize.width < 577 ? "5px 0px 15px 0px" : "15px 0px 25px 0px",
  };

  const onSearchChanges = (x) => {
    x.length > 0
      ? setChildProp({
          searchValue: x,
          isSearchReset: false,
          isTotalReset: false,
        })
      : setChildProp({ ...childProp, searchValue: "", isSearchReset: true });
  };
  return (
    <Container>
      <Row
        align="middle"
        justify="space-around"
        gutter={[0, 15]}
        style={navBarStyles}
      >
        <Col xs={24} sm={10}>
          <Space.Compact
            {...breakPointSetup}
            block
            size={windowsSize.width < 577 ? "middle" : "large"}
          >
            <Input
              name="searchByName"
              placeholder="search by name"
              onChange={(e) => onSearchChanges(e.target.value)}
              suffix={<SearchOutlined />}
              value={childProp.searchValue}
            />
            <Button
              type="primary"
              onClick={() => {
                setChildProp({
                  searchValue: "",
                  isSearchReset: true,
                  isTotalReset: false,
                });
              }}
            >
              Reset
            </Button>
          </Space.Compact>
        </Col>
        <Col>
          <Button
            className="navIcons"
            {...breakPointSetup}
            icon={<SyncOutlined />}
            onClick={() => {
              setChildProp({
                isTotalReset: true,
                searchValue: "",
                isSearchReset: true,
              });
            }}
          />
        </Col>
        <Col>
          <Button
            className="navIcons"
            {...breakPointSetup}
            onClick={() => nav("/main/studentpage/newstudent")}
            icon={<UserAddOutlined />}
          />
        </Col>
        <Col>
          <Button
            className="navIcons"
            {...breakPointSetup}
            icon={<CreditCardOutlined />}
            onClick={() => nav("/main/studentpage/feereceipt")}
          />
        </Col>
      </Row>

      <Studenttable props={childProp} outFunc={studentTableOpt} />
    </Container>
  );
};
