import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Titlecustom } from "../../GenericComponents/Titlecustom";
import { formValidations } from "../../GenericComponents/Modifiers";
const Container = styled.div`
  /* border: 1px solid red; */
  height: calc(100% - 5px);
  & .contentBlock {
    margin-top: 30px;
  }
`;

const customTag = (prop) => {
  switch (prop) {
    case "superadmin":
      return (
        <Tag bordered={false} color="purple">
          Super Admin
        </Tag>
      );
    case "admin":
      return (
        <Tag bordered={false} color="processing">
          Admin
        </Tag>
      );
    case "receiptionist":
      return (
        <Tag bordered={false} color="warning">
          Receiption
        </Tag>
      );
    case "developer":
      return (
        <Tag bordered={false} color="error">
          Devloper
        </Tag>
      );
    case "generaluser":
      return (
        <Tag bordered={false} color="success">
          Gen. User
        </Tag>
      );
    default:
      return (
        <Tag bordered={false} color="red">
          NA
        </Tag>
      );
  }
};

export const LoginProfiles = () => {
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [onCalling, setonCalling] = useState(false);
  const [isopened, setIsopened] = useState(false);
  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    isLoaded: true,
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const apiCall = async () => {
      await axiosInstance
        .get(API.LOGIN_BY_ALL)
        .then((result) => {
          console.log(result.data);
          setTableData(result.data);
          setErrorResponse({ isError: false, isLoaded: false });
        })
        .catch((err) => {
          console.log(err.data);
          setErrorResponse({ isError: true, isLoaded: false });
        });
    };
    apiCall();
  }, [onCalling]);

  const updateProfile = async (prop) => {
    console.log(prop);
    if (prop.type === "delete") {
      await axiosInstance
        .delete(API.LOGIN_ID + prop.id)
        .then((result) => {
          message.success("Record Delete Successfully");
          setonCalling(!onCalling);
        })
        .catch((err) => {
          console.log(err);
          message.error("Failed to Delete");
        });
    } else if (prop.type === "edit") {
      const id = prop.data.id;
      delete prop.data.id;
      console.log(id, prop);
      await axiosInstance
        .put(API.LOGIN_ID + id, prop.data)
        .then((result) => {
          message.success("Record Updated Successfully");
          setIsopened(!isopened);
          setonCalling(!onCalling);
        })
        .catch((err) => {
          console.log(err);
          message.error("Failed to Update");
        });
    } else if (prop.type === "update") {
      console.log(prop);
      await axiosInstance
        .put(API.LOGIN_ID + prop.id, prop.data)
        .then((result) => {
          setonCalling(!onCalling);
          prop.data.isApproved
            ? message.success("Login access Given")
            : message.info("Removed Login Access");
        })
        .catch((err) => {
          console.log(err);
          message.error("Failed to Update");
        });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      width: 100,
      render: (_, data) => (
        <Typography>
          {data.userName} -{customTag(data.role)}
        </Typography>
      ),
    },
    {
      title: "Mail",
      dataIndex: "userMail",
      key: "userMail",
      width: 150,
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      width: 120,
      render: (_, data) => {
        return <Input.Password value={data.password} variant="borderless" />;
      },
    },
    {
      title: "Access",
      dataIndex: "isApproved",
      key: "isApproved",
      width: 70,
      render: (_, data) => {
        return (
          <Switch
            size={windowSize.width < 577 ? "small" : "default"}
            checked={data.isApproved}
            onChange={(e) =>
              updateProfile({
                data: { isApproved: e },
                type: "update",
                id: data.id,
              })
            }
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 75,
      fixed: "right",
      render: (_, record) => (
        <Space size="small" wrap>
          <EditTwoTone
            onClick={() => {
              form.setFieldsValue({ ...record });
              setIsopened(!isopened);
            }}
          />
          <Popconfirm
            title="are u sure ?"
            onConfirm={() => updateProfile({ id: record.id, type: "delete" })}
          >
            <DeleteTwoTone />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Container>
      <Backnavigationbtn title="Logins Information" />
      <div className="contentBlock">
        <Spin spinning={errorResponse.isLoaded}>
          {errorResponse.isError ? (
            <Result status="warning" title="Backend Issue raised" />
          ) : (
            <Table
              columns={columns}
              dataSource={tableData}
              size={windowSize.width < 577 ? "small" : "large"}
              scroll={{ x: 50 }}
              pagination={{
                pageSize: 5,
              }}
            />
          )}
        </Spin>
      </div>
      <Modal
        centered
        open={isopened}
        onCancel={() => setIsopened(!isopened)}
        footer={[]}
      >
        <Titlecustom
          props={{
            data: "Update Profile",
            style: { margin: "10px 0px 20px 0px", textAlign: "center" },
          }}
        />
        <Form
          form={form}
          requiredMark={false}
          onFinish={(e) => updateProfile({ data: e, type: "edit" })}
          onFinishFailed={() =>
            message.error("Invalid Form Filling, check again")
          }
          size={windowSize.width < 577 ? "small" : "middle"}
        >
          <div hidden={true}>
            <Form.Item label="Id" name="id">
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            label="Name"
            name="userName"
            rules={[formValidations.Name, formValidations.Strings]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mail"
            name="userMail"
            rules={[formValidations.Strings, formValidations.email]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[formValidations.Strings]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Row justify="space-around">
              <Button
                type="primary"
                danger
                onClick={() => setIsopened(!isopened)}
              >
                Close
              </Button>
              <Button
                type="primary"
                htmlType="reset"
                ghost
                danger
                onClick={() => form.resetFields()}
              >
                Reset
              </Button>

              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};
