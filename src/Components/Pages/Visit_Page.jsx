import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Visits from "../Blocks/Visits/Visits";

function Visit_Page({ children, ...props }) {
    return (
        <>
            <Header_white />
            <Visits/>
        </>
    );
}

export default Visit_Page;