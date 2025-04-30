import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Events from "../Blocks/Events/Events";

function Event_Page({ children, ...props }) {
    return (
        <>
            {/* <Header_white /> */}
            <Events/>
        </>
    );
}

export default Event_Page;