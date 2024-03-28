import React from "react";
import classes from './About.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import RowBlock from "../../Standart/RowBlock/RowBlock";

import logo from "/public/about_title_logo.png";
import InfoBlock from "../../Standart/InfoBlock/InfoBlock";

import about_certificate from "/public/about_certificate.png";
import about_interaction from "/public/about_interaction.png";
import about_handshake from "/public/about_handshake.png";

function About({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.about_title}>
                        <div className={classes.about_title__left}>
                            <img src={logo} alt="" />
                        </div>
                        <div className={classes.about_title__right}>
                            <div className={classes.about_title__right___name}>О компании</div>
                            <div className={classes.about_title__right___text}>
                                Компания Kars Touristic работает с 2000 года без посредников и наценок — мы уверены в том, что выбирая нас, вы получите от поездок только приятные впечатления и воспоминания на всю жизнь
                            </div>
                        </div>
                    </div>

                    <RowBlock justifyContent={"space-between"}>
                        <InfoBlock width={"33%"}>
                            <img src={about_certificate} alt="" />
                                Сертифицированный туроператор
                        </InfoBlock>
                        <InfoBlock width={"33%"}>
                            <img src={about_interaction} alt="" />
                            <div className={classes.info_block_text}>
                                Работаем без посредников
                            </div>
                        </InfoBlock>
                        <InfoBlock width={"33%"}>
                            <img src={about_handshake} alt="" />
                                Оказываем поддержку клиентам
                        </InfoBlock>
                    </RowBlock>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default About;