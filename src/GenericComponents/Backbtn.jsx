import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  & .buttonStyles {
    background-color: #a8efa2;
  }
  & .buttonClickedStyles {
    background-color: white;
    border-color: #14b10b;
  }
  & .iconStyle {
    font-weight: "bold";
    color: black;
    font-size: "15px";
  }
  & .iconClickedStyles {
    font-weight: "bold";
    color: #14b10b;
    font-size: "20px";
  }
`;

export const Backbtn = () => {
  const [isClick, setisClick] = useState(false);
  return (
    <Container>
      <Button
        className={isClick ? "buttonClickedStyles" : "buttonStyles"}
        icon={
          <ArrowLeftOutlined
            className={isClick ? "iconClickedStyles" : "iconStyle"}
          />
        }
        onClick={() => {
          setisClick(!isClick);
          window.history.back();
        }}
        shape="circle"
      />
    </Container>
  );
};
