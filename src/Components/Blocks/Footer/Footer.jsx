import React, { useEffect, useState } from "react";
import classes from './Footer.module.css';
import { Link } from "react-router-dom";

import logo from '/favicon.webp';
import alazar from '/alazar_light.png';
import tg from '/tg.webp';
import vk from '/vk.webp';

import arnament from '/header_arnament.webp';
import server from '../../../serverConfig';

function Footer({ children, ...props }) {
    const [contactsInfo, setContactsInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/contacts`);
                const data = await response.json();
                setContactsInfo(data);
            } catch (error) {
                console.error("Error fetching contacts info:", error);
            }
        }

        fetchMissionInfo();
    }, []);
    return (
        <>
            <footer>
                <div className={classes.footer_data}>
                    <div className={classes.footer_data__column}>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/"><img src={logo} alt="" /></Link>
                        </div>

                        <div className={classes.footer_data__column___block}>
                            <div className={classes.footer_data__column___text}>
                                <div>Телефон поддержки</div>
                            </div>
                            <div className={classes.footer_data__column___phone}>
                                <a href={`tel:${contactsInfo.phone}`}>{contactsInfo.phone}</a>
                            </div>
                        </div>

                        <div className={classes.footer_data__column___block}>
                            <div className={classes.footer_data__column___text}>
                                <div>Мы в соцсетях:</div>
                            </div>

                            <div className={classes.footer_data__column___soc}>
                                <a href="https://t.me/karstouristic" target="_blank" className={classes.footer_data__column___item____soc}>
                                    <img src={tg} alt="" />
                                </a>
                                <a href="#" target="_blank" className={classes.footer_data__column___item____soc}>
                                    <img src={vk} alt="" />
                                </a>
                            </div>
                        </div>

                        <div className={classes.footer_data__column___block}>
                            <div className={classes.footer_data__column___item}>
                                <a href="#" target="_blank">Политика конфиденциальности</a>
                            </div>
                            <div className={classes.footer_data__column___item}>
                                <a href="#" target="_blank">Пользовательское соглашение</a>
                            </div>
                        </div>
                    </div>
                    <div className={classes.footer_data__columnGap}>
                        <div className={classes.footer_data__column___title}>
                            О нас
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/about">О нас</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/transfer">Трансфер</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/faq">FAQ</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/contacts">Контакты</Link>
                        </div>
                    </div>
                    <div className={classes.footer_data__columnGap}>
                        <div className={classes.footer_data__column___title}>
                            Туристам
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/about">О нас</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/transfer">Трансфер</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/faq">FAQ</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/contacts">Контакты</Link>
                        </div>
                    </div>
                    <div className={classes.footer_data__columnGap}>
                        <div className={classes.footer_data__column___title}>
                            турАгентам
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/about">О нас</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/transfer">Трансфер</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/faq">FAQ</Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/contacts">Контакты</Link>
                        </div>
                    </div>


                    <div className={classes.footer_data__column}>
                        <div className={classes.footer_data__column___title}>
                            г. Черкесск <br />
                            Октябрьская ул., 376Б
                        </div>

                        <div className={classes.footer_data__column___text}>
                            <div>ПН-ПТ:  с 09:00 по 19:00</div>
                            <div>СБ:  с 10:00 до 17:00</div>
                            <div>ВC: выходной</div>
                        </div>

                        <div className={classes.footer_data__column___title}>
                            ОПЛАТА ОНЛАЙН:
                            <img src="/cards.png" alt="" />
                        </div>

                        <div className={classes.footer_data__column___logo}>
                            <a href="https://alazarstudio.ru" target="_blank">
                                <img src={alazar} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <div className={classes.footerArnament}>
                <img src={arnament} alt="" />
            </div>
        </>
    );
}

export default Footer;