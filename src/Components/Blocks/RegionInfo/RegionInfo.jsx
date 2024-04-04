import React, { useState } from "react";
import classes from './RegionInfo.module.css';
import { useParams } from 'react-router-dom';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import Tours from "../../Blocks/Tours/Tours";

import RowBlock from "../../Standart/RowBlock/RowBlock";
import InfoBlock from "../../Standart/InfoBlock/InfoBlock";
import H2 from "../../Standart/H2/H2";
import TeamBlock from "../TeamBlock/TeamBlock";

function RegionInfo({ children, ...props }) {
    const { id } = useParams();

    let regions = [
        {
            id_region: "karachaevo_cherkessiya",
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

        }
    ]

    let id_reg, background, logo, title, desc;

    regions.map((item, index) => {
        if (item.id_region == id) {
            id_reg = item.id_region
            background = item.bg_region
            logo = item.logo_region
            title = item.title_region
            desc = parseHTML(item.desc_region);
        }
    })

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
    };

    return (
        <>
            <div className={classes.main} style={{ backgroundImage: `url('/${background}')` }}>
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.region}>
                            <div className={classes.region_left}>
                                <div className={classes.region_left__logo}><img src={'/' + logo} alt="" /></div>
                                <div className={classes.region_left__title}>{title}</div>
                                <div className={classes.region_left__desc}>{desc}</div>
                            </div>
                            <div className={classes.region_right}>
                                <div className={classes.centerBlock}>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 1 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(1)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_tours.png" alt="" />
                                        Туры
                                    </a>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 2 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(2)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_exkursii.png" alt="" />
                                        Экскурсии
                                    </a>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 3 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(3)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_gidi.png" alt="" />
                                        Гиды
                                    </a>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 4 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(4)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_hotels.png" alt="" />
                                        Отели
                                    </a>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 5 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(5)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_chro_posetit.png" alt="" />
                                        Что посетить
                                    </a>
                                    <a href="#tab-content"
                                        className={`${classes.region_right__item} ${activeTab === 6 ? `${classes.active_region_item}` : ""}`}
                                        onClick={() => handleTabClick(6)}
                                        data-region={id_reg}
                                    >
                                        <img src="/region_events.png" alt="" />
                                        Региональные ивенты
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
                        {activeTab === 1 && <Tours/>}
                        {activeTab === 2 && <div>Content for Tab 2</div>}
                        {activeTab === 3 && <div>Content for Tab 3</div>}
                        {activeTab === 4 && <div>Content for Tab 4</div>}
                        {activeTab === 5 && <div>Content for Tab 5</div>}
                        {activeTab === 6 && <div>Content for Tab 6</div>}
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default RegionInfo;