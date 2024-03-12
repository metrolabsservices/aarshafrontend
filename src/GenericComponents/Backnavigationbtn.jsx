import { Affix, Col, Flex, Row, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import { Backbtn } from "./Backbtn";

const Container = styled.div`
  /* width: 30%; */
  /* background-color: red; */
`;
export const Backnavigationbtn = ({ title }) => {
  return (
    <Container style={title ? { width: "100%" } : { width: "20%" }}>
      {title ? (
        <Affix offsetTop={0}>
          <Flex justify="space-evenly" align="center" className="selectorBox">
            <Backbtn />
            <Typography.Title style={{ margin: "0px" }} level={4}>
              {title}
            </Typography.Title>
          </Flex>
        </Affix>
      ) : (
        <Backbtn />
      )}
    </Container>
  );
};
