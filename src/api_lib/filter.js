import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

const queryFilter = async ({filter, filename}) => {
    const response = await axios.post("/filter", {filter: filter.toLowerCase(), filename});
    return response;
}

export default queryFilter;
