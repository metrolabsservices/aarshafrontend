import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { API } from "../services/api.constants";

const GuardContext = createContext();

export function GuardProvider({ children }) {
  const [dbInfo, setDbInfo] = useState({
    isLoggedin: false,
    isSelectorReady: false,
    isPrintReady: false,
    selectors: {
      id: 0,
      boardTypes: [],
      gradeTypes: [],
      paymentTypes: [],
      studentStatusTypes: [],
      subjectTypes: [],
      transactionTypes: [],
      transactionsCategoryTypes: [],
    },
    printer: {},
  });
  const updateDB = (obj) => {
    let primeObj = { ...dbInfo, ...obj };
    localStorage.setItem("primeObj", JSON.stringify(primeObj));
    setDbInfo(primeObj);
  };
  useEffect(() => {
    const getSelectors = async () => {
      await axiosInstance
        .get(API.SELECTORS_GET)
        .then((result) => {
          let x = result.data;
          console.log({ x }, "main DB");
          updateDB({ isSelectorReady: true, selectors: x });
        })
        .catch((err) => {
          // console.log(err, "main DB");
          updateDB({ isSelectorReady: false, selectors: undefined });
        });
    };
    getSelectors();
  }, []);

  return (
    <GuardContext.Provider value={{ dbInfo, updateDB }}>
      {children}
    </GuardContext.Provider>
  );
}

export function useGuard() {
  return useContext(GuardContext);
}
