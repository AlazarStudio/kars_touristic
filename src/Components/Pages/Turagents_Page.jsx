import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Turagents from "../Blocks/Turagents/Turagents";

function Turagents_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Turagents/>
        </>
    );
}

export default Turagents_Page;