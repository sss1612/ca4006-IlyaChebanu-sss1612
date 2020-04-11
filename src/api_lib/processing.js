import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

export const requestOutputFile = (filename, chunk) => {
  return axios.post("/process", { filename, chunk });
}

