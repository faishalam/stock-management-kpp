import Axios from "axios";

const baseURL = "http://18.142.184.223/";

export const HeroServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

HeroServices.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("Authorization");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
