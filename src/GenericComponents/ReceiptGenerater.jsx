import {
  Button,
  Col,
  Descriptions,
  Divider,
  Flex,
  Row,
  Space,
  Image,
  Typography,
  Skeleton,
  Affix,
} from "antd";
import { useRef, useState } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MedialFiles } from "./../Utility/MediaFiles";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons/faEnvelopeCircleCheck";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons/faPhoneVolume";
import React, { useEffect } from "react";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { useGuard } from "../dbHub/GuardContext";
import { Backnavigationbtn } from "./Backnavigationbtn";
import { Backbtn } from "./Backbtn";

const Container = styled.div`
  width: 100%;
  height: 100%;
  border: 0.1rem solid black;
  border-radius: 15px;
  display: block;
  position: relative;
  padding: 15px;
  & .logoMain {
    text-align: center;
  }
  & .pageHead {
    color: red;
    font-family: "Monotype Corsiva", cursive;
    font-weight: bold;
    font-size: 70px;
    text-align: center;
    margin: 0%;
  }
  & .pageCaption {
    color: green;
    font-family: "Monotype Corsiva", cursive;
    font-size: xx-large;
    font-weight: bolder;
    text-align: center;
    margin: 0%;
  }
  & .receiptContact {
    margin: 0%;
  }
  & .receiptType {
    color: red;
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: underline;
  }
  & .textSize {
    font-size: larger;
  }
  & .textCenter {
    text-align: center;
  }
`;

export const ReceiptGenerater = (props) => {
  const componentRef = useRef(null);
  const [descriptionItems, setDescriptionItems] = useState([
    {
      key: "1",
      label: "Fee ID",
      children: "NA",
    },
    {
      key: "2",
      label: "Trx ID",
      children: "NA",
    },
    {
      key: "3",
      label: "Date",
      children: "NA",
    },
    {
      key: "4",
      label: "Student Name",
      children: "NA",
    },
    {
      key: "5",
      label: "Class",
      children: "NA",
    },
    {
      key: "6",
      label: "Timings",
      children: "NA",
    },
    {
      key: "7",
      label: "Subjects Taken",
      children: "NA",
      span: 1,
    },

    {
      key: "8",
      label: "Fee Paid(In-Words)",
      children: "NA",
    },
    {
      key: "9",
      label: "Amount",
      children: "NA",
    },
    {
      key: "10",
      label: "Due Amount",
      children: "NA",
    },
    {
      key: "11",
      label: "Mode of Pay",
      children: "-",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const { dbInfo, updateDB } = useGuard();
  const downloadPDF = () => {
    // this line captures the content of the HTML elememnt by referrence 'componenetRef.current'
    html2canvas(componentRef.current, {
      scrollY: -window.scrollY,
      useCORS: true, // Add this option to enable CORS support for images
      logging: true, // Optionally enable logging to help debug any issues
    })
      .then((canvas) => {
        try {
          // It is handles the promise returned by html2canvas. Once the canvas is generated successfully, the code inside this block executes.
          const imgData = canvas.toDataURL("image/png");
          const aspectRatio = canvas.width / canvas.height;
          const pdfWidth = 900;
          const pdfHeight = pdfWidth / aspectRatio;
          const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? "l" : "p",
            unit: "px",
            format: [pdfWidth, pdfHeight],
          });
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("download.pdf");
        } catch (error) {
          console.error("Error creating PDF:", error);
        }
      })
      .catch((error) => {
        console.error("Error converting HTML to canvas:", error);
      });
  };

  useEffect(() => {
    if (dbInfo.isPrintReady) {
      let printData = dbInfo.printer;
      let otp = descriptionItems.map((i) => {
        const { key } = i;
        return { ...i, children: printData[key] || i.children };
      });
      console.log("Printer Data ------", dbInfo, otp);
      setDescriptionItems(otp);
      setLoading(false);
    }
  }, []);

  const myDescription = (prop) => (
    <Flex justify="space-between" align="center">
      {prop.map((i, idx) => (
        <Space key={idx} direction="horizontal" size={5}>
          <Typography.Text className="textSize">{i.label}</Typography.Text>
          <Typography.Text className="textSize">:</Typography.Text>
          <Typography.Text className="textSize" strong>
            {i.children}
          </Typography.Text>
        </Space>
      ))}
    </Flex>
  );

  const fontSizesResp = {};
  const textCenter = {
    style: {
      textAlign: "center",
    },
  };
  return (
    <div>
      <Affix offsetTop={0}>
        <Flex justify="space-evenly" align="center" className="selectorBox">
          <Backbtn />
          <Typography.Title style={{ margin: "0px" }} level={4}>
            Fee Reciept Generator
          </Typography.Title>
          <Button
            icon={<VerticalAlignBottomOutlined />}
            onClick={downloadPDF}
            style={{
              borderBlockColor: "white",
              backgroundColor: "#000f80e8",
              color: "white",
            }}
          >
            Download
          </Button>
        </Flex>
      </Affix>
      <div style={{ maxHeight: "100%", overflowY: "auto" }}>
        <Skeleton loading={loading}>
          <Container ref={componentRef} style={{ marginTop: "15px" }}>
            <Row align="middle">
              <Col span={5} className="logoMain">
                <Image
                  src={MedialFiles.images.logoWithoutBackground}
                  preview={false}
                />
              </Col>
              <Col span={19}>
                <Typography.Title className="pageHead">
                  AARSHA TUITIONS
                </Typography.Title>
                <Typography.Paragraph className="pageCaption">
                  Learning is Timeless
                </Typography.Paragraph>
              </Col>
              <Col span={24} style={{ textAlign: "center" }}>
                <Space direction="horizontal" align="baseline" size={10}>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <Typography.Paragraph className="receiptAddress textSize">
                    1<sup>st</sup> Floor, H No 5-300, Daya, Sriram Nagar Colony,
                    Golden Temple Road, Manikonda, Hyderabad - 89
                  </Typography.Paragraph>
                </Space>
              </Col>
              <Col span={24}>
                <Flex justify="space-between" align="center">
                  <Space direction="horizontal" align="baseline" size={10}>
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                    <Typography.Paragraph className="receiptContact textSize">
                      Email - aarshatuitions@gmail.com
                    </Typography.Paragraph>
                  </Space>
                  <Space direction="horizontal" align="baseline" size={10}>
                    <FontAwesomeIcon icon={faPhoneVolume} />
                    <Typography.Paragraph className="receiptContact textSize">
                      Phone - +91 9392621532
                    </Typography.Paragraph>
                  </Space>
                </Flex>
              </Col>
              <Col span={24}>
                <Typography.Paragraph className="pageCaption receiptType">
                  TUITION FEE
                </Typography.Paragraph>
              </Col>
              <Col span={24}>
                {myDescription([
                  descriptionItems[0],
                  descriptionItems[1],
                  descriptionItems[2],
                ])}
                {myDescription([
                  descriptionItems[3],
                  descriptionItems[4],
                  descriptionItems[5],
                ])}
                {myDescription([descriptionItems[6]])}
                {myDescription([descriptionItems[7], descriptionItems[8]])}
                {myDescription([descriptionItems[10]])}
                {myDescription([descriptionItems[9]])}
              </Col>
            </Row>
            <Image
              src={MedialFiles.images.paidStamp}
              style={{
                width: 150,
                height: 150,
                zIndex: 1,
                position: "absolute",
                right: -700,
                bottom: -20,
              }}
            />
          </Container>
          {/* <Button
            icon={<VerticalAlignBottomOutlined />}
            size="large"
            style={{
              borderBlockColor: "white",
              backgroundColor: "#000f80e8",
              color: "white",
              marginTop: "15px",
            }}
            onClick={downloadPDF}
          >
            Download
          </Button> */}
        </Skeleton>
      </div>
    </div>
  );
};
