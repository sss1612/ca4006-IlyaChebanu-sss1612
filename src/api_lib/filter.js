import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const queryFilter = async bodyData => {
    const response = await axios.post("/filter", bodyData);
    return response;
}

export default queryFilter;
