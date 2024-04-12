import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Faq from "../Blocks/Faq/Faq";

function Faq_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Faq/>
        </>
    );
}

export default Faq_Page;