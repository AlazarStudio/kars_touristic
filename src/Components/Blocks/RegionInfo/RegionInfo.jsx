import React, { useState, useEffect } from "react";
import classes from './RegionInfo.module.css';
import { useParams } from 'react-router-dom';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import Tabs from "../../Blocks/Tabs/Tabs";
import Non_Found_Page from "../../Pages/Non_Found_Page";

import server from '../../../serverConfig'

function RegionInfo({ children, ...props }) {
    const { id } = useParams();

    const [regions, setRegions] = useState([]);

    const fetchRegions = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => setRegions(data.regions))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const foundRegion = regions.find(region => region.link === id);

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

        window.scrollTo({
            top: '950',
            behavior: 'smooth'
        });
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
                foundRegion
                    ?
                    <>
                        <div className={classes.main} style={{ backgroundImage: `url('${server}/refs/${foundRegion.backgroundImgPath}')` }}>
                            <CenterBlock>
                                <WidthBlock>
                                    <div className={classes.region}>
                                        <div className={classes.region_left}>
                                            <div className={classes.region_left__logo}>
                                                <img src={server + '/refs/' + foundRegion.iconPath} alt="" />
                                            </div>
                                            <div className={classes.region_left__title}>
                                                {foundRegion.title}
                                            </div>
                                            <div className={classes.region_left__desc}>
                                                {parseHTML(foundRegion.description)}
                                            </div>
                                        </div>
                                        <div className={classes.region_right}>
                                            <div className={classes.centerBlock}>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 1 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(1)}
                                                >
                                                    <img src="/region_tours.png" alt="" />
                                                    Многодневные туры
                                                </div>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 2 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(2)}
                                                >
                                                    <img src="/region_exkursii.png" alt="" />
                                                    Однодневные экскурсии
                                                </div>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 3 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(3)}
                                                >
                                                    <img src="/region_gidi.png" alt="" />
                                                    Авторские туры
                                                </div>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 4 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(4)}
                                                >
                                                    <img src="/region_hotels.png" alt="" />
                                                    Отели
                                                </div>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 5 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(5)}
                                                >
                                                    <img src="/region_chro_posetit.png" alt="" />
                                                    Что посетить
                                                </div>
                                                <div
                                                    className={`${classes.region_right__item} ${activeTab === 6 ? `${classes.active_region_item}` : ""}`}
                                                    onClick={() => handleTabClick(6)}
                                                >
                                                    <img src="/region_events.png" alt="" />
                                                    Региональные Mice ивенты
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </WidthBlock>
                            </CenterBlock>

                        </div>

                        <CenterBlock>
                            <WidthBlock>
                                <div>
                                    {activeTab === 1 && <Tabs regionName={id} titleObject={'tourTitle'} pageName={'tours'} tableName={'multidayTour'} requestType={'getMultidayTours'} title={'Многодневные туры'} />}
                                    {activeTab === 2 && <Tabs regionName={id} titleObject={'tourTitle'} pageName={'excursions'} tableName={'onedayTour'} requestType={'getOnedayTours'} title={'Однодневные экскурсии'} />}
                                    {activeTab === 3 && <Tabs regionName={id} pageName={'gids'} tableName={''} title={'Авторские туры'} />}
                                    {activeTab === 4 && <Tabs regionName={id} titleObject={'title'} pageName={'hotels'} tableName={'hotels'} requestType={'getHotels'} title={'Отели'} />}
                                    {activeTab === 5 && <Tabs regionName={id} titleObject={'title'} pageName={'visits'} tableName={'places'} requestType={'getPlaces'} title={'Что посетить'} />}
                                    {activeTab === 6 && <Tabs regionName={id} titleObject={'title'} pageName={'events'} tableName={'events'} requestType={'getEvents'} title={'Региональные Mice ивенты'} />}
                                </div>
                            </WidthBlock>
                        </CenterBlock>
                    </>
                    :
                    <Non_Found_Page />
            }

        </>
    );
}

export default RegionInfo;