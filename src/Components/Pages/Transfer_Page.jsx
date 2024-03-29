import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Transfer from "../Blocks/Transfer/Transfer";

function Transfer_Page({ children, ...props }) {
    return (
        <>
            <Header_black />
            <Transfer/>
        </>
    );
}

export default Transfer_Page;