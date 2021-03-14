import axios from "axios";

let client = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: { "Cache-Control": "no-cache" },
  responseType: "json",
});

export default client;
