import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";
import NumberShow from "../Blocks/NumberShow/NumberShow";

function Number_Page({  children, handleOpen, isSimillar, user, setUser, ...props }) {
    return (
        <>
            {/* <Header_black /> */}
            <NumberShow  isSimillar={false} user={user} setUser={setUser} />
        </>
    );
}

export default Number_Page;