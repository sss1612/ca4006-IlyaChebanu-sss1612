import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const uploadFile = bodyData => {
    axios.post("/upload", bodyData);
}

export default uploadFile;
