import React from "react";
import classes from './Faq.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import Accordion from "../Accordion/Accordion";

import faq_bg from "/faq_bg.png";

function Faq({ children, ...props }) {
    const items = [
        { title: 'Как производится оплата тура?', content: 'Содержимое 1' },
        { title: 'Какие документы требуются для оформления тура?', content: 'Содержимое 2' },
        { title: 'Что делать в случае отмены или изменения тура?', content: 'Содержимое 3' },
        { title: 'Как происходит возврат средств при отмене тура?', content: 'Содержимое 4' },
        { title: 'Каков процесс работы с турагентством?', content: 'После того, как вы связались с нами для подбора тура, наш опытный менеджер предложит вам различные варианты туров, учитывая ваши пожелания и бюджет. По вашему выбору мы оформим бронь и предоставим всю необходимую информацию о туре и условиях путешествия. Вы всегда можете обратиться к нам с вопросами и просьбами - мы сделаем все возможное, чтобы ваше путешествие стало незабываемым и беззаботным.' },
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