import React from "react";
import { useParams } from "react-router-dom";

export const TransactionForm = () => {
  const { id } = useParams();
  return <div>TransactionForm - {id}</div>;
};
