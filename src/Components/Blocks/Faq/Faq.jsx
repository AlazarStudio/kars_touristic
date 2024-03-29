import React from "react";
import classes from './Faq.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import Accordion from "../Accordion/Accordion";

import faq_bg from "/faq_bg.png";

function Faq({ children, ...props }) {
    const items = [
        { title: 'Заголовок 1', content: 'Содержимое 1' },
        { title: 'Заголовок 2', content: 'Содержимое 2' },
        { title: 'Заголовок 3', content: 'Содержимое 3' },
      ];

    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"FAQ"}
                        text={"Здесь мы предлагаем широкий спектр информации, которая поможет вам найти ответы на все ваши вопросы."}
                        bgImg={faq_bg}
                    />

                    <Accordion items={items} />
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Faq;