import React from "react";
import classes from './Transfer.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";

import tg from "/tg.png";

function Transfer({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.transfer}>
                        <div className={classes.transfer_block}>
                            <div className={classes.transfer_topTitle}>Kars Drive</div>
                            <div className={classes.transfer_title}>Заказать трансфер из любого города</div>
                            <div className={classes.transfer_text}>
                                Трансфер прямо из аэропорта. Заберем в указанном месте и с комфортом доставим в любое место назначения. Только опытные водители и безопасные поездки!
                            </div>
                        </div>
                        <div className={classes.transfer_block}>
                            <a href="#" target="_blank" className={classes.transfer_link}>
                                <img src={tg} alt="" />
                                <div className={classes.transfer_link__text}>НАПИСАТЬ В TELEGRAM</div>
                            </a>
                        </div>

                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Transfer;