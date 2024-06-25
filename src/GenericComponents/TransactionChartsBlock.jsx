import {
  Button,
  Col,
  DatePicker,
  Flex,
  Result,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import axiosInstance from "../services/axiosInstance";
import { API } from "../services/api.constants";
import {
  customDateRanges,
  defaultDateFormatter,
  toDateConverter,
} from "./Modifiers";
import { PieChartBlock } from "./PieChartBlock";
import { TransactionStatsChart } from "./TransactionStatsChart";

const Container = styled.div`
  height: 55vh;
  border: 1px solid white;

  & .alignment {
    display: flex;
    justify-content: center;
  }
  & .chartblock {
  }
`;
export const TransactionChartsBlock = ({ props }) => {
  const todayDate = "";
  const [rawChartData, setrawChartData] = useState([]);
  const [datePickerInput, setDatePickerInput] = useState();
  const [dateInput, setDateInput] = useState({
    from: toDateConverter({
      data: new Date().toLocaleDateString() + ", 12:00:00 AM",
      type: "ISO",
    }),
    to: toDateConverter({
      data: new Date().toLocaleDateString() + ", 11:59:59 PM",
      type: "ISO",
    }),
  });
  const [pageHandler, setPageHandler] = useState({
    isError: false,
    isLoaded: true,
    errorMessage: "",
  });
  const [apiTrigger, setApiTrigger] = useState(false);

  function getRequiredDate(presentDate) {
    const day = String(presentDate.getDate()).padStart(2, "0");
    const month = String(presentDate.getMonth() + 1).padStart(2, "0");
    const year = presentDate.getFullYear();
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    const apiCall = async () => {
      await axiosInstance
        .post(API.TRANSACTION_CHART, dateInput)
        .then((result) => {
          // console.log(result.data);
          setrawChartData(result.data);
          setPageHandler({
            isError: false,
            isLoaded: false,
            errorMessage: "",
          });
        })
        .catch((err) => {
          setPageHandler({
            isError: true,
            isLoaded: false,
            errorMessage: "Failed to retrieve transaction data",
          });
        });
    };
    apiCall();
  }, [apiTrigger]);

  const onDateChange = (dateData) => {
    setDatePickerInput(dateData);
    const dateRefined = {
      from: toDateConverter({
        data: new Date(dateData[0]).toLocaleDateString() + ", 12:00:00 AM",
        type: "ISO",
      }),
      to: toDateConverter({
        data: new Date(dateData[1]).toLocaleDateString() + ", 11:59:59 PM",
        type: "ISO",
      }),
    };

    setDateInput(dateRefined);
    setApiTrigger(!apiTrigger);
    // console.log(
    //   "from",
    //   new Date(dateData[0]).toDateString(),
    //   "to",
    //   new Date(dateData[1]).toDateString()
    // );
  };

  //   console.log(props);

  const onResetHandler = () => {
    setDatePickerInput([
      dayjs(
        getRequiredDate(new Date()),
        defaultDateFormatter.generalFormat_DD_MM_YYYY
      ),
      dayjs(
        getRequiredDate(new Date()),
        defaultDateFormatter.generalFormat_DD_MM_YYYY
      ),
    ]);
    setDateInput({
      from: toDateConverter({
        data: new Date().toLocaleDateString() + ", 12:00:00 AM",
        type: "ISO",
      }),
      to: toDateConverter({
        data: new Date().toLocaleDateString() + ", 11:59:59 PM",
        type: "ISO",
      }),
    });
    setApiTrigger(!apiTrigger);
  };
  return (
    <Container>
      {pageHandler.isError ? (
        <Result
          title={pageHandler.errorMessage}
          style={{ padding: "10px 20px", margin: 0, height: "100%" }}
        />
      ) : (
        <Spin spinning={pageHandler.isLoaded}>
          <Row gutter={[0, 10]}>
            <Col span={24} className="alignment">
              <Space.Compact>
                <DatePicker.RangePicker
                  presets={customDateRanges}
                  format={defaultDateFormatter.generalFormat_DD_MM_YYYY}
                  onChange={onDateChange}
                  value={datePickerInput}
                  defaultValue={[
                    dayjs(
                      getRequiredDate(new Date()),
                      defaultDateFormatter.generalFormat_DD_MM_YYYY
                    ),
                    dayjs(
                      getRequiredDate(new Date()),
                      defaultDateFormatter.generalFormat_DD_MM_YYYY
                    ),
                  ]}
                />
                <Button onClick={onResetHandler}>Reset</Button>
              </Space.Compact>
            </Col>
            <Col span={8} className="alignment chartblock">
              <PieChartBlock props={rawChartData} />
            </Col>
            <Col span={16}>
              <TransactionStatsChart props={rawChartData} />
            </Col>
          </Row>
        </Spin>
      )}
    </Container>
  );
};
