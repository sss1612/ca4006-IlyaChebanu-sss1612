import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { actions as queryActions } from "../store/query/query";
import { selectors as windowStateSelectors } from "../store/windowState/windowState";

const onChangeHandler = (event, filterProps, setFilterProps) => {
    const {
        value: fieldText,
        id: fieldName
    } = event.target;

    if (fieldText) {
        setFilterProps({
            ...filterProps,
            [fieldName]: fieldText
        })
    }
}

const validateFilterData = (object, callback) => {
    const {filter, filename} = object;
    if (filter && filename && filter.length === 3 && filter[1] === "-")
        callback(object);
}

const FilterFields = props => {
    const { queryChunkSpecs, currentSelectedFile } = props;
    const [filterProps, setFilterProps] = useState({filter:null, filename: null});

    // when selected file changes, update local prop
    useEffect(() => {
        setFilterProps({...filterProps, filename: currentSelectedFile});
    },[currentSelectedFile])

    return (
        <>
            <p className={"filterParagraph"}>Enter the desired and filter</p>
            <input id={"filter"} placeholder={"a-c"} onChange={e => onChangeHandler(e, filterProps, setFilterProps)} />
            <button onClick={() => validateFilterData(filterProps, queryChunkSpecs)}>Send filter</button>
        </>
    )
}

const mapDispatchToProps = dispatch =>({
    queryChunkSpecs: filterProps => dispatch(queryActions.queryFilter(filterProps)),
  })

const mapStateToProps = state => ({
    currentSelectedFile: windowStateSelectors.getCurrentSelectedUploadedFileSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterFields);
