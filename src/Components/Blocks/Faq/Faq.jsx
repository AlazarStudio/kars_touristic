import React from "react";
import classes from './Faq.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";

import faq_bg from "/faq_bg.png";

function Faq({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"FAQ"}
                        text={"Здесь мы предлагаем широкий спектр информации, которая поможет вам найти ответы на все ваши вопросы."}
                        bgImg={faq_bg}
                    />
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Faq;