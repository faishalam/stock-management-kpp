import Axios from "axios";

const baseURL = "https://stock-management.cloud/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
