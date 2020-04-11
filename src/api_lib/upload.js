import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const uploadFile = bodyData => {
    return axios.post("/upload", bodyData);
}

export default uploadFile;
