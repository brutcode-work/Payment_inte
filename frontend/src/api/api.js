import axios from "axios";

const BASE_URI = import.meta.env.VITE_BASE_URI || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URI,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
