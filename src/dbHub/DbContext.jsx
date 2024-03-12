import React, { createContext, useContext, useState } from "react";

const DbContext = createContext();

export function DbProvider({ prop }) {
  const [dbInfo, setDbInfo] = useState({});
  const updateDB = (obj) => {
    setDbInfo({ ...dbInfo, ...obj });
  };
  return (
    <DbContext.Provider value={{ dbInfo, updateDB }}>{prop}</DbContext.Provider>
  );
}

export function DBhub() {
  return useContext(DbContext);
}
