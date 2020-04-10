import React from "react";
import uploadFile from "../api_lib/upload";

const onChangeHandler = (event) => {
    const [file] = event.target.files
    const body_data = new FormData()
    // https://stackoverflow.com/questions/31495499/multer-configuration-with-app-use-returns-typeerror/31495796#31495796
    body_data.append("recfile", file);
    uploadFile(body_data);
}

const UploadFileButton = props => {
    return (
        <>
            <form encType="multipart/form-data">
                <input type="file" name="name" onChange={(e) => onChangeHandler(e)} />
            </form>
        </>
    )
}

export default UploadFileButton;
