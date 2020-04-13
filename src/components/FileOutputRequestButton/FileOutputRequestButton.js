import React from "react";
import "./FileOutputRequestButton.css";

const ButtonComponent = (props) => {
    const { callBack: requestOutputFile, filename } = props
    const [literalFilterName, filterName] = filename.split(":")
    return (
        <div className="Button-wrapper" onClick={()=>{requestOutputFile(...filename.split(':')) }}>
            <p className="text-wrapper">{literalFilterName}: [{filterName}]</p>
        </div>
    );
}

export default ButtonComponent;
