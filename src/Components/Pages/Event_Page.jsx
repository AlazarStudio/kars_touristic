import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Events from "../Blocks/Events/Events";

function Event_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_white />
            <Events/>
        </>
    );
}

export default Event_Page;