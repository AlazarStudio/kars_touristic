import React from "react";
import Header_black from "../Blocks/Header_black/Header_black";

function Non_Found_Page({ children, ...props }) {
    return (
        <>
            <Header_black />
            <div className="nonFoundPage">
                Страница не найдена
            </div>
        </>
    );
}

export default Non_Found_Page;