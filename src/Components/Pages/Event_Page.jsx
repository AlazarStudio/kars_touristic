import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Events from "../Blocks/Events/Events";

function Event_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Events/>
        </>
    );
}

export default Event_Page;