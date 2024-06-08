import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Main from "../Blocks/Main/Main";

function Main_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Main />
        </>
    );
}

export default Main_Page;