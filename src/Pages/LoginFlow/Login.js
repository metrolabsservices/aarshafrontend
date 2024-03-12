import {
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Result,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { useGuard } from "../../dbHub/GuardContext";
const { Text, Title } = Typography;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #004580;

  & .custBtnProp {
    display: flex;
    justify-content: space-between;
  }
  & .signin_form {
    width: 90%;
    text-align: center;
    background-color: #ffffff;
  }
  & .btnProp {
    padding: 0px 30px;
  }
  & .ant-result-title,
  .ant-result-subtitle {
    color: #ffffff;
  }
  & .loginBtn {
    width: 140px;
    height: 40px;
    border: none;
    padding: 5px 25px;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(16.5px);
    -webkit-backdrop-filter: blur(16.5px);
  }
  @media (min-width: 600px) {
    & .signin_form {
      width: 40%;
    }
    & .btnProp {
      padding: 0px 50px;
      height: 35px;
    }
    & .custBtnProp {
      display: flex;
      justify-content: space-around;
    }
  }
`;

const Login = () => {
  const Nav = useNavigate();
  const [isAuthorized, setisAuthorized] = useState(false);
  const { updateDB } = useGuard();
  const onFinish = async (vlv) => {
    await axiosInstance
      .put(API.LOGIN, vlv)
      .then((result) => {
        message.success("Good to Go");
        // console.log(result.data);
        updateDB({ loginInfo: result.data });
        Nav("/main/home");
      })
      .catch((err) => {
        console.log(err.response.data.ErrorMessage);
        if (err.response.data.ErrorMessage === "Not Approved") {
          setisAuthorized(true);
        } else {
          message.error(err.response.data.ErrorMessage);
        }
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Container>
      {isAuthorized ? (
        <Result
          status="403"
          title="Not Approved"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button
              ghost
              className="loginBtn"
              onClick={() => window.location.reload()}
            >
              Login
            </Button>
          }
        />
      ) : (
        <Card className="signin_form">
          <Title level={3} style={{ margin: "0px 0px 20px  0px" }}>
            Login
          </Title>
          <Form
            name="login_form"
            title="Login"
            variant="filled"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
            colon={false}
          >
            <Form.Item
              label="Mail"
              name="userMail"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Space className="custBtnProp">
                <Button
                  type="primary"
                  danger
                  htmlType="reset"
                  className="btnProp"
                >
                  Reset
                </Button>
                <Button type="primary" htmlType="submit" className="btnProp">
                  Login
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Typography.Paragraph>
            If you don't have account to use, you can{" "}
            <Link to={"/register"} style={{ color: "blueviolet" }}>
              -Register-
            </Link>
          </Typography.Paragraph>
          <Link to={"/register"} style={{ color: "red" }}>
            Forgot Password ?
          </Link>
        </Card>
      )}
    </Container>
  );
};

export default Login;
