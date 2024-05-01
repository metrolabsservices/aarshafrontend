import {
  AlignCenterOutlined,
  ContainerOutlined,
  SafetyCertificateOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuard } from "../../dbHub/GuardContext";
import { NavBtn } from "../../GenericComponents/NavBtn";

import styled from "styled-components";
const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  height: 100%;
  & .btnsSec {
    margin-top: 0.8rem;
  }
`;

export const Dashboard = () => {
  const nav = useNavigate();
  const { dbInfo } = useGuard();
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
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  const ButtonsList = [
    {
      label: "Tution Fee",
      icon: <ContainerOutlined />,
      routeLink: "/main/home/studentinfo",
      isDisabled: false,
    },
    {
      label: "Selectors List",
      icon: <AlignCenterOutlined />,
      routeLink: "/main/home/masterselectors",
      isDisabled: false,
    },
    {
      label: "Logins Info",
      icon: <SafetyCertificateOutlined />,
      routeLink: "/main/home/loginprofiles",
      isDisabled: false,
    },
    {
      label: "Student Info",
      icon: <UsergroupDeleteOutlined />,
      routeLink: "/main/home/studentinfo",
      isDisabled: false,
    },
  ];
  return (
    <Container>
      <Row gutter={[20, 30]} className="btnsSec">
        {ButtonsList.map((i) => (
          <Col
            span={windowSize.width < 577 ? 12 : 6}
            style={{ textAlign: "center" }}
          >
            <NavBtn {...i} responsive={windowSize} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
