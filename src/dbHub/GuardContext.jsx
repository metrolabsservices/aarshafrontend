import React, { createContext, useContext, useState } from "react";

const GuardContext = createContext();

export function GuardProvider({ children }) {
  const [dbInfo, setDbInfo] = useState({});
  const updateDB = (obj) => {
    setDbInfo({ ...dbInfo, ...obj });
  };
  return (
    <GuardContext.Provider value={{ dbInfo, updateDB }}>
      {children}
    </GuardContext.Provider>
  );
}

export function useGuard() {
  return useContext(GuardContext);
}
