import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Hotels from "../Blocks/Hotels/Hotels";

function Tours_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_white />
            <Hotels/>
        </>
    );
}

export default Tours_Page;