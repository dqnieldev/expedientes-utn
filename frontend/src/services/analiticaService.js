import axios from "axios";
import "./axiosConfig";
import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAnaliticaDataset = async () => {
  const response = await axios.get(`${API_URL}/analitica/dataset`, getAuthHeaders());
  return response.data;
};
