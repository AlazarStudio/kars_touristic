import React from "react";
import classes from './Turagents.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import H2 from "../../Standart/H2/H2";
import Form from "../Form/Form";

import turagents_bg from "/turagents_bg.png";

function Turagents({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"Турагентам"}
                        bgImg={turagents_bg}
                    />
                    <div className={classes.turagentsText}>
                        <p>Уважаемые представители Туристических Агентств!</p>
                        <p>Убедительная просьба заполнять договоры печатными буквами.</p>
                        <p>Просьба не заполнять раздел с номером и датой договора!</p>
                        <p>Если у Вас срочное бронирование, Вы можете скачать договор, заполнить и подписать его, отсканировать все страницы и послать их нам по электронной почте.</p>
                        <p>Оригинал договора необходимо послать обычной почтой либо курьером на адрес в разделе Контакты.</p>
                        <p>Будем рады видеть Вас в числе наших партнеров!</p>
                    </div>
                    <div className={classes.turagentsButtons}>
                        <a href="" className={classes.turagentsButtons_item}>Агентский договор</a>
                        <a href="" className={classes.turagentsButtons_item}>Отчет Агента</a>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Turagents;