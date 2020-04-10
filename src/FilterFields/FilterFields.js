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

const FilterFields = props => {
    const { queryChunkSpecs } = props;
    const [filterProps, setFilterProps] = useState({});

    return (
        <>
            <p className={"filterParagraph"}>Enter the desired and filter</p>
            <input id={"filename"} placeholder={"file.txt"} onChange={e => onChangeHandler(e, filterProps, setFilterProps)}/>
            <input id={"filter"} placeholder={"a-c"} onChange={e => onChangeHandler(e, filterProps, setFilterProps)} />
            <button onClick={() => queryChunkSpecs(filterProps)}>Send filter</button>
        </>
    )
}

const mapDispatchToProps = dispatch =>({
    queryChunkSpecs: filterProps => dispatch(queryActions.queryFilter(filterProps))
  })

export default connect(null, mapDispatchToProps)(FilterFields);
