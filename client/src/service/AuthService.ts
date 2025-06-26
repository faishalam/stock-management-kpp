import Axios from "axios";

const baseURL = "http://18.142.184.223/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
