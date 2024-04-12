import React from "react";
import Header_white from "../Blocks/Header_white/Header_white";

function Non_Found_Page({ children, ...props }) {
    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
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