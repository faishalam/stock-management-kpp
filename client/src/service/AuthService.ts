import Axios from "axios";

// const baseURL = "https://stock-management.cloud/";
const baseURL = "http://localhost:3000/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
