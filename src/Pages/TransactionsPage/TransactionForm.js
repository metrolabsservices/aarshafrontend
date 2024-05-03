import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";

const Container = styled.div`
  /* height: 25vh; */
  border: 1px solid red;
`;
export const TransactionForm = () => {
  const { id, type } = useParams();
  console.log(id, type, "---- Form Page Data");
  return (
    <Container>
      <Backnavigationbtn
        title={
          type === "edit"
            ? "Edit Form"
            : type === "add"
            ? "Add New Transaction"
            : "Transaction Details"
        }
      />
    </Container>
  );
};
