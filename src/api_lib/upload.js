import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
const uploadFile = async bodyData => {
    try {
        await axios.post("/upload", bodyData);
    } catch (error) {
        console.log(error)
        alert("Action could not be completed. Please do not reupload duplicate filenames or view disk usage and upload smaller file sizes")
    }
}

export default uploadFile;
