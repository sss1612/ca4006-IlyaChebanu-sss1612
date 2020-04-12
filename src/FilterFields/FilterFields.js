import React, { useState } from 'react';
import { connect } from "react-redux";
import { actions as queryActions } from "../store/query/query";

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
    const {filter} = object;
    if (filter && filter.length === 3 && filter[1] === "-")
        callback(object);
}

const FilterFields = props => {
    const { queryChunkSpecs } = props;
    const [filterProps, setFilterProps] = useState({filter:null, filename: null});

    return (
        <>
            <p className={"filterParagraph"}>Enter the desired and filter</p>
            <input id={"filename"} placeholder={"file.txt"} onChange={e => onChangeHandler(e, filterProps, setFilterProps)}/>
            <input id={"filter"} placeholder={"a-c"} onChange={e => onChangeHandler(e, filterProps, setFilterProps)} />
            <button onClick={() => validateFilterData(filterProps, queryChunkSpecs)}>Send filter</button>
        </>
    )
}

const mapDispatchToProps = dispatch =>({
    queryChunkSpecs: filterProps => dispatch(queryActions.queryFilter(filterProps))
  })

export default connect(null, mapDispatchToProps)(FilterFields);
