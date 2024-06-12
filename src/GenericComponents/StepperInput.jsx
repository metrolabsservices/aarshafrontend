import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import React from "react";
import { useState } from "react";

export const StepperInput = ({ value, onChange }) => {
  const stepperTimeList = [
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
    "5:30",
    "6:00",
  ];

  const stepperUpdate = (operator) => {
    const currentIndex = stepperTimeList.indexOf(value);

    let newIndex;
    if (operator === "+") {
      newIndex = currentIndex + 1;
      if (newIndex >= stepperTimeList.length) {
        message.error("Limit exceeded, 6hrs is Max");
        return;
      }
    } else if (operator === "-") {
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        message.error("1hr is Minimun");
        return;
      }
    }

    onChange(stepperTimeList[newIndex]);
  };

  return (
    <Input
      prefix={<MinusOutlined onClick={() => stepperUpdate("-")} />}
      suffix={<PlusOutlined onClick={() => stepperUpdate("+")} />}
      status=""
      className="stepperInput"
      value={value}
      defaultValue={value}
      readOnly
    />
  );
};
