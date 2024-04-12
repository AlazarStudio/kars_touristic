import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import About from "../Blocks/About/About";

function About_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <About/>
        </>
    );
}

export default About_Page;