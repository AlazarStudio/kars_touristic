import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import NumberShow from "../Blocks/NumberShow/NumberShow";

function Number_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <NumberShow/>
        </>
    );
}

export default Number_Page;