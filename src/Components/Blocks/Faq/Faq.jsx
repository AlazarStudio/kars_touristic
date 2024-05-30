import React, { useState, useEffect } from "react";
import classes from './Faq.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import Accordion from "../Accordion/Accordion";

import faq_bg from "/faq_bg.png";
import server from '../../../serverConfig';

function Faq({ children, ...props }) {
    const [faq, setFaq] = useState([]);

    useEffect(() => {
        async function fetchFaq() {
            try {
                const response = await fetch(`${server}/api/faq`);
                const data = await response.json();
                setFaq(data);
            } catch (error) {
                console.error("Error fetching faq info:", error);
            }
        }

        fetchFaq();
    }, []);

    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"FAQ"}
                        text={"Здесь мы предлагаем широкий спектр информации, которая поможет вам найти ответы на все ваши вопросы."}
                        bgImg={faq_bg}
                    />

                    <Accordion items={faq} />
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Faq;