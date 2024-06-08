import React from "react";
import classes from './Transfer.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";

import tg from "/tg.webp";
import transfer_bg from "/transfer_bg.webp";

function Transfer({ children, data, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"Kars Drive"}
                        title={data.title}
                        text={data.description}
                        link={data.link}
                        linkText={"НАПИСАТЬ В TELEGRAM"}
                        bgImg={transfer_bg}
                        iconImg={tg}
                        mb={"40px"}
                    />
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Transfer;

