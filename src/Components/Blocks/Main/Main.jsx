import React from "react";
import classes from './Main.module.css';

import main_1 from "/public/main_1.png";
import main_2 from "/public/main_2.png";
import main_3 from "/public/main_3.png";
import main_4 from "/public/main_4.png";
import main_5 from "/public/main_5.png";
import main_6 from "/public/main_6.png";
import main_7 from "/public/main_7.png";
import main_8 from "/public/main_8.png";
import main_9 from "/public/main_9.png";
import main_10 from "/public/main_10.png";
import main_11 from "/public/main_11.png";

import main_2_logo from "/public/main_2_logo.png";
import main_3_logo from "/public/main_3_logo.png";
import main_4_logo from "/public/main_4_logo.png";
import main_5_logo from "/public/main_5_logo.png";
import main_6_logo from "/public/main_6_logo.png";
import main_7_logo from "/public/main_7_logo.png";
import main_8_logo from "/public/main_8_logo.png";
import main_9_logo from "/public/main_9_logo.png";
import main_10_logo from "/public/main_10_logo.png";
import main_11_logo from "/public/main_11_logo.png";
import Region from "../Region/Region";

function Main({ children, ...props }) {
    let regionData = [
        {
            title: "Все регионы",
            link: 'vse_regiony',
            bg: main_1,
            logo: ''
        },
        {
            title: "Карачаево-Черкессия",
            link: 'karachaevo_cherkessiya',
            bg: main_2,
            logo: main_2_logo
        },
        {
            title: "Кабардино-Балкария",
            link: 'kabardino_balkariya',
            bg: main_3,
            logo: main_3_logo
        },
        {
            title: "Осетия",
            link: 'osetiya',
            bg: main_4,
            logo: main_4_logo
        },
        {
            title: "Ингушетия",
            link: 'ingushetiya',
            bg: main_5,
            logo: main_5_logo
        },
        {
            title: "Чечня",
            link: 'chechnya',
            bg: main_6,
            logo: main_6_logo
        },
        {
            title: "Дагестан",
            link: 'dagestan',
            bg: main_7,
            logo: main_7_logo
        },
        {
            title: "Адыгея",
            link: 'adigeya',
            bg: main_8,
            logo: main_8_logo
        },
        {
            title: "Краснодарский край",
            link: 'krasnodarsky_kray',
            bg: main_9,
            logo: main_9_logo
        },
        {
            title: "Ставропольский край",
            link: 'stavropolsky_kray',
            bg: main_10,
            logo: main_10_logo
        },
        {
            title: "Абхазия",
            link: 'abhaziya',
            bg: main_11,
            logo: main_11_logo
        }
    ]
    return (
        <>
            <div className={classes.main}>
                <div className={classes.main_title}>Организуем ваш отдых на Кавказе</div>
                <div className={classes.main_desc}>Подберем индивидуальный тур с учетом ваших пожеланий</div>
                <div className={classes.main_blocks}>
                    {
                        regionData.reverse().map((item, index) => (
                            <Region key={index} link={item.link} title={item.title} bg={item.bg} logo={item.logo} />
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Main;