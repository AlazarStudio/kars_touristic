import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Main from "../Blocks/Main/Main";

function Main_Page({ children, tempMain,...props }) {   
    return (
        <>
            <Header_black tempMain={tempMain}/>
            <Main tempMain={tempMain}/>
        </>
    );
}

export default Main_Page;