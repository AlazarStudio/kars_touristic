import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";
import RegionInfo from "../Blocks/RegionInfo/RegionInfo";

function RegionInfo_Page({ children, ...props }) {
    return (
        <>
            <Header_white />
            <RegionInfo/>
        </>
    );
}

export default RegionInfo_Page;