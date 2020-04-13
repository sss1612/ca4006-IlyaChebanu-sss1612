import React from "react";
import { connect } from "react-redux";
import uploadFile from "../api_lib/upload";
import "./UploadFileButton.css"
import {
    actions as sharedStateActions,
    selectors as sharedStateSelectors
 } from "../../shared/store/sharedState";

const onChangeHandler = (event) => {
    const [file] = event.target.files
    const body_data = new FormData()
    // https://stackoverflow.com/questions/31495499/multer-configuration-with-app-use-returns-typeerror/31495796#31495796
    body_data.append("recfile", file);
    uploadFile(body_data);
}

const UploadFileButton = props => {
    const { diskSimulationIsTrue, overrideSimulatedDiskSpace } = props;
    const overrideButtonText = diskSimulationIsTrue ? "on" : "off"
    const buttonOverrideClass = diskSimulationIsTrue ? "DiskOverrideButton-on" : "DiskOverrideButton-off"

    return (
        <>
            <input type="file" name="name" onChange={(e) => onChangeHandler(e)} />
            <button className={buttonOverrideClass} onClick={() => overrideSimulatedDiskSpace(!diskSimulationIsTrue)}>Simulate disk space full ({overrideButtonText})</button>
        </>
    )
}

const mapDispatchToProps = dispatch => ({
    overrideSimulatedDiskSpace: flag => dispatch(sharedStateActions.simulateForcedDiskSpace(flag))
})

const mapStateToProps = state => ({
    diskSimulationIsTrue: sharedStateSelectors.getForcedFullDiskSpaceIsTrue(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadFileButton);
