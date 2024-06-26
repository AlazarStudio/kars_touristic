import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Tours from "../Blocks/Tours/Tours";

function Tours_Page({ children, requestType, pageName, tableName, similar, ...props }) {
    return (
        <>
            <Header_white />
            <Tours requestType={requestType} pageName={pageName} tableName={tableName} similar={similar}/>
        </>
    );
}

export default Tours_Page;