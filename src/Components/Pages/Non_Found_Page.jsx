import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";

function Non_Found_Page({ children, ...props }) {
    return (
        <>
            <Header_white />
            <div className="nonFoundPage">
                Страница не найдена
            </div>
        </>
    );
}

export default Non_Found_Page;