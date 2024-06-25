import { Button, Space, Typography } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const Container = styled.div`
  & .btnProp {
    display: inline-block;
    outline: 0;
    border: 0;
    cursor: pointer;
    color: black;
    font-size: 14px;
    background-image: linear-gradient(180deg, #fff, #f5f5fa);
    box-shadow: 0 4px 11px 0 rgb(37 44 97 / 15%),
      0 1px 3px 0 rgb(93 100 148 / 20%);
    transition: all 0.2s ease-out;
  }
  & .btnProp:hover {
    box-shadow: 0 8px 22px 0 rgb(37 44 97 / 15%),
      0 4px 6px 0 rgb(93 100 148 / 20%);
  }
`;
export const NavBtn = ({ label, routeLink, icon, isDisabled, responsive }) => {
  useEffect(() => {}, []);
  const nav = useNavigate();
  return (
    <Container>
      {responsive.width < 577 ? (
        <Space direction="vertical" align="center">
          <Button
            icon={icon}
            className="btnProp"
            shape="circle"
            disabled={isDisabled}
            onClick={() => nav(routeLink)}
          />
          <Typography.Text strong>{label}</Typography.Text>
        </Space>
      ) : (
        <Button
          className="btnProp"
          icon={icon}
          disabled={isDisabled}
          onClick={() => nav(routeLink)}
        >
          {label}
        </Button>
      )}
    </Container>
  );
};
