import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../../Blocks/Header_white/Header_white"
import Footer from "../../Blocks/Footer/Footer";


function Empty({ children, tempMain, ...props }) {
    return (
        <>
            {/* <Header/> */}
            <Outlet />
            <Footer />
        </>
    );
}

export default Empty;