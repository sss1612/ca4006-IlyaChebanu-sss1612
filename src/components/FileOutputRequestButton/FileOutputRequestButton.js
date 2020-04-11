import React from "react";
import "./FileOutputRequestButton.css";

const ButtonComponent = (props) => {
    const { callBack: requestOutputFile, filename } = props
    return (
        <div className="Button-wrapper" onClick={()=>{requestOutputFile(...filename.split(':')) }}>
            <p className="text-wrapper">{filename}</p>
        </div>
    );
}

export default ButtonComponent;
