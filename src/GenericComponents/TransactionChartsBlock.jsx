import { Flex, Typography } from "antd";
import React from "react";

import styled from "styled-components";

const Container = styled.div`
  height: 25vh;
  border: 1px solid red;
`;
export const TransactionChartsBlock = ({ props }) => {
  //   console.log(props);
  return (
    <Container>
      <Flex justify="space-evenly" align="center" style={{ height: "100%" }}>
        <Typography.Text>Pie Chart</Typography.Text>
        <Typography.Text>Stats</Typography.Text>
      </Flex>
    </Container>
  );
};
