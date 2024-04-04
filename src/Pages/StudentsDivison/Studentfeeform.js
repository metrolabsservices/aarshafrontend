import { Flex, Select } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchInput } from "../../GenericComponents/SearchInput";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";

const Container = styled.div``;
export const Studentfeeform = () => {
  return (
    <Container>
      <Backnavigationbtn title="Fee Reciept Generator" />
      <SearchInput placeholder="Search by Name" />
    </Container>
  );
};
