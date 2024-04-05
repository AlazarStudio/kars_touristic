import React, { useState, useEffect } from "react";
import classes from './RegionInfo.module.css';
import { useParams } from 'react-router-dom';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import Tabs from "../../Blocks/Tabs/Tabs";
import Non_Found_Page from "../../Pages/Non_Found_Page";

function RegionInfo({ children, ...props }) {
    const { id } = useParams();

    let regionData = {
        "karachaevo_cherkessiya": {
            bg_region: "RegionInfo_kchr_bg.png",
            logo_region: "main_2_logo.png",
            title_region: "Карачаево-Черкесская Республика",
            desc_region: `
                <p>Карачаево-Черкесская Республика была образована 12 января 1922 года как Карачаево-Черкесская автономная область и в 1992 году преобразована в республику.
                </p><p>
                Карачаево-Черкесия располагается в предгорьях северо-западного Кавказа. Большая часть (около 80%) Карачаево-Черкесской Республики расположена в горной местности.
                </p><p>
                Современная Карачаево-Черкесия — субъект Российской Федерации в составе Северо-Кавказского федерального округа, расположена в северо-западной части предгорий Кавказа. Её территория составляет 14 277 кв. км. На западе республика граничит с Краснодарским краем, на севере и северо-востоке со Ставропольским краем, на востоке с Кабардино-Балкарией, на юге — вдоль Главного Кавказского хребта — с Грузией и Абхазией.
                </p>
            `,
            tours: [
                {
                    img: "object_1.png",
                    title: "«Нoвогодняя сказка Кавказа»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Черкесск",
                    category: "Познавательные",
                    date: "2024-04-05",
                    tripType: "Групповая поездка"
                },
                {
                    img: "object_2.png",
                    title: "«Нoвогодние каникулы на Кавказе»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Карачаевск",
                    category: "Гастрономические",
                    date: "2024-04-06",
                    tripType: "Индивидуальная поездка"
                },
                {
                    img: "object_3.png",
                    title: "«Нoвогоднее путешествие по Кавказу»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Архыз",
                    category: "Конные",
                    date: "2024-04-05",
                    tripType: "Индивидуальная поездка"
                },
                {
                    img: "object_1.png",
                    title: "«Нoвогодняя сказка Кавказа»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Черкесск",
                    category: "Познавательные",
                    date: "2024-04-05",
                    tripType: "Групповая поездка"
                },
                {
                    img: "object_2.png",
                    title: "«Нoвогодние каникулы на Кавказе»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Карачаевск",
                    category: "Гастрономические",
                    date: "2024-04-06",
                    tripType: "Индивидуальная поездка"
                },
                {
                    img: "object_3.png",
                    title: "«Нoвогоднее путешествие по Кавказу»",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Архыз",
                    category: "Конные",
                    date: "2024-04-05",
                    tripType: "Индивидуальная поездка"
                },
            ],
            gids: [
                {
                    img: "object_1.png",
                    title: "гид",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Черкесск",
                    category: "Познавательные",
                    date: "2024-04-05",
                    tripType: "Групповая поездка"
                },
                {
                    img: "object_1.png",
                    title: "гид",
                    price: "От 10000 р.",
                    priceImg: "priceImg.png",
                    city: "Карачаевск",
                    category: "Конные",
                    date: "2024-04-05",
                    tripType: "Групповая поездка"
                }
            ]
        }
    }
    const regionInfo = regionData[id];

    const tours = regionInfo?.tours || [];
    const gids = regionInfo?.gids || [];

    function parseHTML(htmlString) {
        const domParser = new DOMParser();
        const parsedDocument = domParser.parseFromString(htmlString, 'text/html');

        function parseNode(node, index) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const props = {};
                for (let i = 0; i < node.attributes.length; i++) {
                    const { name, value } = node.attributes[i];
                    props[name] = value;
                }
                const children = Array.from(node.childNodes).map(parseNode);
                return React.createElement(node.tagName.toLowerCase(), { key: index, ...props }, ...children);
            }
        }

        return Array.from(parsedDocument.body.childNodes).map(parseNode);
    }

    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (index) => {
        setActiveTab(index);
        localStorage.setItem("activeTab", index.toString());
    };

    useEffect(() => {
        const storedTab = localStorage.getItem("activeTab");
        if (storedTab) {
            setActiveTab(parseInt(storedTab));
        }
    }, []);

    return (
        <>
            {
                regionInfo
                    ?
                    <>
                        <div className={classes.main} style={{ backgroundImage: `url('/${regionInfo.bg_region}')` }}>
                            <CenterBlock>
                                <WidthBlock>
                                    <div className={classes.region}>
                                        <div className={classes.region_left}>
                                            <div className={classes.region_left__logo}><img src={'/' + regionInfo.logo_region} alt="" /></div>
                                            <div className={classes.region_left__title}>{regionInfo.title_region}</div>
                                            <div className={classes.region_left__desc}>{parseHTML(regionInfo.desc_region)}</div>
                                        </div>
                                        <div className={classes.region_right}>
                                            <div className={classes.centerBlock}>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 1 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(1)}
                                                >
                                                    <img src="/region_tours.png" alt="" />
                                                    Многодневные туры
                                                </a>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 2 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(2)}
                                                >
                                                    <img src="/region_exkursii.png" alt="" />
                                                    Однодневные экскурсии
                                                </a>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 3 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(3)}
                                                >
                                                    <img src="/region_gidi.png" alt="" />
                                                    Авторские туры
                                                </a>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 4 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(4)}
                                                >
                                                    <img src="/region_hotels.png" alt="" />
                                                    Отели
                                                </a>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 5 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(5)}
                                                >
                                                    <img src="/region_chro_posetit.png" alt="" />
                                                    Что посетить
                                                </a>
                                                <a href="#tab-content"
                                                    className={`${classes.region_right__item} ${activeTab === 6 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(6)}
                                                >
                                                    <img src="/region_events.png" alt="" />
                                                    Региональные Mice ивенты
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </WidthBlock>
                            </CenterBlock>

                        </div>

                        <CenterBlock>
                            <WidthBlock>
                                <div id="tab-content">
                                    {activeTab === 1 && <Tabs objects={tours} />}
                                    {activeTab === 2 && <div>Content for Tab 2</div>}
                                    {activeTab === 3 && <Tabs objects={gids} />}
                                    {activeTab === 4 && <div>Content for Tab 4</div>}
                                    {activeTab === 5 && <div>Content for Tab 5</div>}
                                    {activeTab === 6 && <div>Content for Tab 6</div>}
                                </div>
                            </WidthBlock>
                        </CenterBlock>
                    </>
                    :
                    <Non_Found_Page/>
            }

        </>
    );
}

export default RegionInfo;