import React from "react";
import classes from './Footer.module.css';
import { Link } from "react-router-dom";

import logo from '/favicon.webp';
import alazar from '/alazar_logo.webp';
import tg from '/tg.webp';
import vk from '/vk.webp';

import arnament from '/header_arnament.webp';

function Footer({ children, ...props }) {
    return (
        <>
            <footer>
                <div className={classes.footer_data}>
                    <div className={classes.footer_data__column}>
                        <div className={classes.footer_data__column___item}>
                            <Link to="/"><img src={logo} alt="" /></Link>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <a href="#" target="_blank">Политика конфиденциальности</a>
                        </div>
                        <div className={classes.footer_data__column___item}>
                            <a href="#" target="_blank">Пользовательское соглашение</a>
                        </div>
                    </div>
                    <div className={classes.footer_data__columnGap}>
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
                        <div className={classes.footer_data__column___phone}>
                            <a href="tel:+78005500488">+7 (800) 550-04-88</a>
                        </div>
                        <div className={classes.footer_data__column___text}>
                            <div>Телефон поддержки</div>
                        </div>
                        <div className={classes.footer_data__column___soc}>
                            <a href="#" target="_blank" className={classes.footer_data__column___item____soc}>
                                <img src={tg} alt="" />
                            </a>
                            <a href="#" target="_blank" className={classes.footer_data__column___item____soc}>
                                <img src={vk} alt="" />
                            </a>
                        </div>
                    </div>
                    <div className={classes.footer_data__column}>
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