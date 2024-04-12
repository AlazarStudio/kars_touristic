import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import Contacts from "../Blocks/Contacts/Contacts";

function Contacts_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    return (
        <>
            <Header_black />
            <Contacts/>
        </>
    );
}

export default Contacts_Page;