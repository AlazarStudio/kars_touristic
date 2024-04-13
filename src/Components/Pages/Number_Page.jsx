import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Hotels from "../Blocks/Hotels/Hotels";

function Number_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            Number_Page
        </>
    );
}

export default Number_Page;