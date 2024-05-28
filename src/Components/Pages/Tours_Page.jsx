import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Tours from "../Blocks/Tours/Tours";

function Tours_Page({ children, requestType, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_white />
            <Tours requestType={requestType}/>
        </>
    );
}

export default Tours_Page;