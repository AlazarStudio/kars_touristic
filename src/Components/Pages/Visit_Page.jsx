import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Visits from "../Blocks/Visits/Visits";

function Visit_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Visits/>
        </>
    );
}

export default Visit_Page;