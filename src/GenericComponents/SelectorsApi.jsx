import { API } from "../services/api.constants";
import axiosInstance from "../services/axiosInstance";

export const CustomSelectorsList = async () =>
  await axiosInstance
    .get(API.SELECTORS_GET)
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return {};
    });
