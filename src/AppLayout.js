import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  SignatureOutlined,
  BellOutlined,
  UsergroupDeleteOutlined,
  DeploymentUnitOutlined,
  BookOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LogoutOutlined,
  EditFilled,
} from "@ant-design/icons";
import styled from "styled-components";
import {
  Avatar,
  Breadcrumb,
  Button,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
  Image,
  Popover,
  Tooltip,
  Form,
  List,
  Modal,
  Input,
} from "antd";
import { useGuard } from "./dbHub/GuardContext";
import { MedialFiles } from "./Utility/MediaFiles";
const { Header, Content, Footer, Sider } = Layout;

const Container = styled.div`
  & .borderBox {
    border: "3px solid red";
  }
  & .headerContainer {
    width: 100%;
    height: auto;
    padding: 3px 15px;
    background: rgba(166, 255, 156, 0.39);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(6.1px);
    -webkit-backdrop-filter: blur(6.1px);
  }

  /* & .contentContainer1 {
    padding: 15px;
    height: 100vh;
    background-color: whitesmoke;
  } */
  & .footerContainer {
    padding: 10px 0px;
    text-align: center;
    background-color: #e9ffe6;
  }

  & .ant-menu-light > .ant-menu,
  .ant-menu-item-selected {
    background-color: #e9ffe6;
    color: #14b10b;
  }
  & .ant-layout .ant-layout-sider-light .ant-layout-sider-trigger {
    background: #14b10b;
    color: white;
  }

  & .profileBtn {
    border-radius: 50%;
    border: none;
    padding: 0%;
  }
  & .loginProfileBox {
    /* width: 80px; */
  }
`;

const items = [
  {
    id: 1,
    label: "Home",
    icon: <HomeOutlined />,
    route: "main/home",
    disabled: false,
  },
  {
    id: 2,
    label: "Student.Mng",
    icon: <UsergroupDeleteOutlined />,
    route: "studentpage",
    disabled: false,
  },
  {
    id: 3,
    label: "Expenses.Mng",
    icon: <DeploymentUnitOutlined />,
    route: "Home_C",
    disabled: false,
  },
  {
    id: 4,
    label: "Library.Mng",
    icon: <BookOutlined />,
    route: "Home_D",
    disabled: false,
  },
  {
    id: 5,
    label: "Question Bank",
    icon: <FileDoneOutlined />,
    route: "Home_E",
    disabled: false,
  },
];

export const AppLayout = () => {
  const nav = useNavigate();
  const { dbInfo } = useGuard();
  const [collapsed, setCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isProfileOpened, setIsProfileOpened] = useState(false);
  const [isDisplayFooter, setIsDisplayFooter] = useState(false);
  const [isupdateModalopen, setIsupdateModalopen] = useState(false);
  const headerContainerInside = {
    //   width: "100vw",
    height: "auto",
  };
  const containerBox = {
    padding: isDisplayFooter ? "0px" : "15px",
    height: isDisplayFooter ? "calc(100vh - 122px)" : "calc(100vh - 70px)",
    backgroundColor: "whitesmoke",
  };

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setIsDisplayFooter(window.innerWidth < 577);
    setCollapsed(window.innerWidth < 769);
  };
  console.log(dbInfo);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    setIsDisplayFooter(window.innerWidth < 577);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const routerRoute = (x) => {
    console.log(x);
    x = x.key;
    x = "/" + items[parseInt(x.charAt(x.length - 1))].route;
    console.log(x);
    return nav(x);
  };
  const loginProfileBox = (
    <Container>
      <Typography.Title level={5} style={{ margin: "10px 0px" }}>
        Super Admin
      </Typography.Title>
      <List
        className="loginProfileBox"
        dataSource={[
          { title: "Update", icon: <SignatureOutlined /> },
          { title: "Signout", icon: <LogoutOutlined /> },
        ]}
        renderItem={(i) => (
          <List.Item
            onClick={() => {
              if (i.title === "Update") {
                setIsupdateModalopen(!isupdateModalopen);
              } else {
                nav("/");
              }
              setIsProfileOpened(false);
            }}
          >
            <Space>
              {i.icon}
              <Typography.Text>{i.title}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </Container>
  );
  return (
    <Container>
      <Layout>
        <Header className="headerContainer">
          <Flex
            style={headerContainerInside}
            justify="space-between"
            align="center"
          >
            <Avatar
              src={MedialFiles.icons.superadmin}
              size={{
                xs: 50,
                sm: 55,
                md: 60,
                lg: 65,
                xl: 70,
                xxl: 80,
              }}
            />
            <Space wrap={true} align="center" size="large">
              <BellOutlined style={{ fontSize: "20px" }} />
              <Popover
                trigger="click"
                className="popoverProp"
                content={loginProfileBox}
                open={isProfileOpened}
              >
                <Button
                  className="profileBtn"
                  onClick={() => setIsProfileOpened(!isProfileOpened)}
                  icon={
                    <Image
                      src={MedialFiles.icons.developer}
                      alt="Prof"
                      preview={false}
                    />
                  }
                />
              </Popover>
            </Space>
          </Flex>
        </Header>
        <Layout style={{ height: "auto" }}>
          {isDisplayFooter ? (
            ""
          ) : (
            <Sider
              theme="light"
              collapsible
              collapsed={collapsed}
              width={155}
              onCollapse={(value) => setCollapsed(value)}
              collapsedWidth={50}
            >
              <Menu
                theme="light"
                items={items}
                onClick={(e) => routerRoute(e)}
              />
            </Sider>
          )}

          <Content style={containerBox}>
            <div
              style={{
                height: "100%",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: isDisplayFooter ? "0%" : "10px",
                boxShadow: isDisplayFooter
                  ? "rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset"
                  : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
        {isDisplayFooter ? (
          <Footer className="footerContainer">
            <Flex justify="space-evenly" align="center">
              {items.map((i) => (
                <Button
                  // type="text"
                  key={i.id}
                  shape="circle"
                  onClick={() => nav(i.route)}
                >
                  {i.icon}
                </Button>
              ))}
            </Flex>
          </Footer>
        ) : (
          ""
        )}
      </Layout>
      <Modal
        title="Update Profile"
        centered
        open={isupdateModalopen}
        onCancel={() => setIsupdateModalopen(!isupdateModalopen)}
      >
        <Form size="small">
          <Form.Item label="Name">
            <Input />
          </Form.Item>
          <Form.Item label="Mail">
            <Input />
          </Form.Item>
          <Form.Item label="New Password">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};
