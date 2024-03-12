import { Flex, Select } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchInput } from "../../GenericComponents/SearchInput";

const Container = styled.div``;
export const Studentfeeform = () => {
  const [channels, setChannels] = useState({
    mobileView: false,
    tabletView: false,
    laptopView: false,
    desktopView: false,
  });

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
  }, []);
  return (
    <Container>
      <SearchInput placeholder="Search by Name" />
    </Container>
  );
};
