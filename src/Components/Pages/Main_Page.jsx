import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Main from "../Blocks/Main/Main";

function Main_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_white />
            <Main />
        </>
    );
}

export default Main_Page;