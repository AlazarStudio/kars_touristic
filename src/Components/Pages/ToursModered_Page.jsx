import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import ToursModered from "../Blocks/ToursModered/ToursModered";

function ToursModered_Page({ children, requestType, pageName, tableName, similar, ...props }) {
    return (
        <>
            <Header_white />
            <ToursModered requestType={requestType} pageName={pageName} tableName={tableName} similar={similar}/>
        </>
    );
}

export default ToursModered_Page;