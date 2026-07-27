import axios from "axios";
import "./axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAnaliticaDataset = async () => {
  const response = await axios.get(`${API_URL}/analitica/dataset`, getAuthHeaders());
  return response.data;
};
