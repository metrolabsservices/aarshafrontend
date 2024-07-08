import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Backnavigationbtn } from "../../GenericComponents/Backnavigationbtn";
import axiosInstance from "../../services/axiosInstance";
import { API } from "../../services/api.constants";
import {
  toCamelCaseString,
  toCaptalizeString,
} from "../../GenericComponents/Modifiers";
import {
  DeleteTwoTone,
  EditTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

const Container = styled.div`
  background-color: white;
  // border: 1px solid red;
  height: 100%;
  & .addSelector {
    font-size: x-large;
  }
  & .selectorDivision {
    margin: 0%;
  }

  & .itemBlock {
    padding: 15px;
  }
`;

export const MasterSelectors = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [form] = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [onError, setOnError] = useState({ err: false, loaded: true });
  const [interupt, setinterupt] = useState(false);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    type: "",
    key: "",
    value: "",
  });
  const [mainData, setMainData] = useState({});
  const dtModifier = (prop) => {
    let ot = Object.entries(prop)
      .filter((k) => k[0] !== "id" && k[0] !== "transactionsCategoryTypes")
      .map((i, j) => ({
        id: j,
        head: toCaptalizeString(i[0]),
        data: i[1],
      }));
    return ot;
  };

  if (openModal.isOpen) {
    form.setFieldsValue({ [openModal.key]: openModal.value });
  }
  const itemContainer = {
    marginTop: 25,
    maxHeight:
      windowSize.width > 576 ? "calc(100vh - 180px)" : "calc(100vh - 205px)",
    overflowX: "auto",
  };
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    const apiCall = async () => {
      await axiosInstance
        .get(API.SELECTORS_GET)
        .then((result) => {
          let x = result.data;

          setMainData(x);
          //   console.log({ x });
          let dt = dtModifier(x);
          console.log(dt);
          setDataSource(dt);
          setOnError({ err: false, loaded: false });
        })
        .catch((err) => {
          console.log(err);
          setOnError({ err: true, loaded: false });
        });
    };
    apiCall();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [interupt]);
  console.log(windowSize.width);
  const updateDate = async (props) => {
    let pack = [];
    if (props.type === "deleted") {
      console.log(props);
      let mainKey = toCamelCaseString(props.key);
      pack = mainData[mainKey].filter((i) => i !== props.value);
      pack = { [mainKey]: pack };
    } else if (props.type === "edited") {
      console.log(props, "-----");
      pack = {
        [props.key]: mainData[props.key].map((i) =>
          i === props.value[0] ? props.value[1] : i
        ),
      };
    } else if (props.type == "added") {
      console.log(props);
      pack = mainData[props.key].concat(props.value);
      pack = { [props.key]: pack };
    }
    // console.log(pack);
    await axiosInstance
      .put(API.SELECTORS_UPDATE + String(mainData.id), pack)
      .then((result) => {
        // console.log(result.data);
        message.success(`Record ${props.type}`);
        setinterupt(!interupt);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container>
      {onError.err ? (
        <Result status="warning" title="Server side operations failed." />
      ) : (
        <>
          <Backnavigationbtn title="Master Selector" />

          <Spin spinning={onError.loaded}>
            <List
              style={itemContainer}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={dataSource}
              renderItem={(j, idx) => (
                <List.Item
                  key={j.id || idx}
                  id={j.id || idx}
                  className="itemBlock"
                >
                  <Card
                    title={j.head}
                    extra={
                      <PlusCircleTwoTone
                        className="addSelector"
                        twoToneColor="#52c41a"
                        onClick={() => {
                          console.log(j);
                          setOpenModal({
                            isOpen: true,
                            type: "added",
                            key: toCamelCaseString(j.head),
                            value: "",
                          });
                        }}
                      />
                    }
                  >
                    {j.data.map((i) => (
                      <Row>
                        <Col span={15}>
                          <Typography.Text>{i}</Typography.Text>
                        </Col>
                        <Col>
                          <Space>
                            <EditTwoTone
                              onClick={() => {
                                setOpenModal({
                                  isOpen: true,
                                  type: "edited",
                                  key: toCamelCaseString(j.head),
                                  value: i,
                                });
                              }}
                            />
                            <p></p>
                            <Popconfirm
                              placement="topRight"
                              title={`are u sure to delete ${i}?`}
                              okText="YES"
                              cancelText="No"
                              cancelButtonProps={{
                                type: "primary",
                                ghost: true,
                              }}
                              onConfirm={() =>
                                updateDate({
                                  type: "deleted",
                                  key: j.head,
                                  value: i,
                                })
                              }
                            >
                              <DeleteTwoTone twoToneColor="red" />
                            </Popconfirm>
                          </Space>
                        </Col>
                        <Col span={24}>
                          <Divider className="selectorDivision" />
                        </Col>
                      </Row>
                    ))}
                  </Card>
                </List.Item>
              )}
            />
          </Spin>
        </>
      )}
      <Modal
        title={openModal.type == "edited" ? "Update Selector" : "Add Selector"}
        okText="Submit"
        open={openModal.isOpen}
        cancelButtonProps={{
          type: "primary",
          ghost: true,
        }}
        onOk={() => {
          let valued = form.getFieldsValue();
          let x = {
            ...openModal,
            value:
              openModal.type === "added"
                ? valued[openModal.key]
                : [openModal.value, valued[openModal.key]],
          };
          // console.log(valued, x);
          setOpenModal({ isOpen: false, type: "", key: "", value: "" });
          updateDate(x);
        }}
        onCancel={() => setOpenModal({ ...openModal, isOpen: false })}
      >
        <Form form={form}>
          <Form.Item name={openModal.key}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};
