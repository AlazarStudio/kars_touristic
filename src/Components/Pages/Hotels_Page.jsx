import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Hotels from "../Blocks/Hotels/Hotels";

function Tours_Page({ children, ...props }) {    
    return (
        <>
            <Header_white />
            <Hotels/>
        </>
    );
}

export default Tours_Page;