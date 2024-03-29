import React from "react";
import classes from './Transfer.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";

import tg from "/tg.png";
import transfer_bg from "/transfer_bg.png";

function Transfer({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"Kars Drive"}
                        title={"Заказать трансфер из любого города"}
                        text={"Трансфер прямо из аэропорта. Заберем в указанном месте и с комфортом доставим в любое место назначения. Только опытные водители и безопасные поездки!"}
                        linkText={"НАПИСАТЬ В TELEGRAM"}
                        bgImg={transfer_bg}
                        iconImg={tg}
                    />
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Transfer;