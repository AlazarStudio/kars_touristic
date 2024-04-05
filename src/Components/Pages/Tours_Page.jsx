import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Tours from "../Blocks/Tours/Tours";

function Tours_Page({ children, ...props }) {
    return (
        <>
            <Header_white />
            <Tours/>
        </>
    );
}

export default Tours_Page;