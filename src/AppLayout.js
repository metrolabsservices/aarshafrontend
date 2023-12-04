import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  BellOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  DashboardTwoTone,
  UsergroupDeleteOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  BookOutlined,
  FileDoneOutlined,
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
} from "antd";
const { Header, Content, Footer, Sider } = Layout;

const Container = styled.div`
  & .borderBox {
    border: "3px solid red";
  }
  & .headerContainer {
    width: 100%;
    height: auto;
    padding: 3px 15px;
    background-color: blue;
  }

  /* & .contentContainer1 {
    padding: 15px;
    height: 100vh;
    background-color: whitesmoke;
  } */
  & .footerContainer {
    padding: 10px 0px;
    text-align: center;
    background-color: yellow;
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
`;

const items = [
  {
    id: 1,
    label: "Home",
    icon: <DashboardOutlined />,
    route: "",
    disabled: false,
  },
  {
    id: 2,
    label: "Student.Mng",
    icon: <UsergroupDeleteOutlined />,
    route: "Home_B",
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
  const nav = new useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isDisplayFooter, setIsDisplayFooter] = useState(false);
  const headerContainerInside = {
    //   width: "100vw",
    height: "auto",
  };
  const containerBox = {
    // padding: "15px",
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

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    setIsDisplayFooter(window.innerWidth < 577);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const routerRoute = (x) => {
    x = x.key;
    x = "/" + items[parseInt(x.charAt(x.length - 1))].route;
    console.log(x);
    return nav(x);
  };
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
              src="/logo.svg"
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
              <Button shape="circle" icon={<DesktopOutlined />} />
            </Space>
          </Flex>
        </Header>
        <Layout>
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
                height: isDisplayFooter ? "100%" : "80vh",
                margin: isDisplayFooter ? "0px" : "15px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: isDisplayFooter ? "0%" : "10px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
    </Container>
  );
};
