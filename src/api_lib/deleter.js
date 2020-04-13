import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";


export const deleteInputFile = filename => {
  return axios.delete(`/input?filename=${filename}`);
}

export const deleteOutputFile = filename => {
  return axios.delete(`/output?filename=${filename}`);
}
