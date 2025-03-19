import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import Hotels from "../Blocks/Hotels/Hotels";

function Tours_Page({ children, handleOpen, isSimillar,user, ...props }) {
    return (
        <>
            {/* <Header_white /> */}
            <Hotels handleOpen={handleOpen} isSimillar={false} user={user}/>
        </>
    );
}

export default Tours_Page;