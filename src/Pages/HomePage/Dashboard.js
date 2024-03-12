import {
  AlignCenterOutlined,
  ContainerOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGuard } from "../../dbHub/GuardContext";
import { NavBtn } from "../../GenericComponents/NavBtn";

const Container = styled.div`
  background-color: white;
  /* border: 1px solid red; */
  height: 100%;
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
  }, []);

  const ButtonsList = [
    {
      label: "Tution Fee",
      icon: <ContainerOutlined />,
      routeLink: "",
      isDisabled: false,
    },
    {
      label: "Selectors List",
      icon: <AlignCenterOutlined />,
      routeLink: "/home/masterselectors",
      isDisabled: false,
    },
    {
      label: "Logins Info",
      icon: <ContainerOutlined />,
      routeLink: "",
      isDisabled: false,
    },
    {
      label: "Student Fee",
      icon: <ContainerOutlined />,
      routeLink: "",
      isDisabled: false,
    },
  ];
  return (
    <Container>
      <Row gutter={[0, 30]}>
        {ButtonsList.map((i) => (
          <Col span={12} style={{ textAlign: "center" }}>
            <NavBtn {...i} responsive={windowSize} />
          </Col>
        ))}
      </Row>

      {/* <NavBtn
            title="Master Selectors"
            icon={<ContainerOutlined />}
            routeLink="/home"
            responsive={windowSize}
          />
          <Button
            type="primary"
            size="small"
            icon={<AlignCenterOutlined />}
            onClick={() => nav("/home/masterselectors")}
          >
            Master Selectors
          </Button>
          <NavBtn
            title="Login Credentials"
            icon={<SafetyCertificateOutlined />}
            routeLink="/home"
            responsive={windowSize}
          /> */}
    </Container>
  );
};
