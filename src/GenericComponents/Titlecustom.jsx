import { Typography } from "antd";
import React from "react";

export const Titlecustom = ({ props }) => {
  return (
    <div>
      <Typography.Title
        level={props.level ? props.level : 4}
        style={
          props.style ? { ...props.style } : { margin: 0, textAlign: "center" }
        }
      >
        {props.data}
      </Typography.Title>
    </div>
  );
};
