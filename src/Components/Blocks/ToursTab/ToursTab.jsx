import React, { useState } from "react";
import classes from './ToursTab.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ToursTab({ children, tabs, ...props }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

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
                    if (name === "style") {
                        const styleObj = {};
                        value.split(";").forEach(styleRule => {
                            const [key, val] = styleRule.split(":");
                            if (key && val) {
                                const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                                styleObj[camelKey] = val.trim();
                            }
                        });
                        props[name] = styleObj;
                    } else {
                        props[name] = value;
                    }
                }
                
                const children = Array.from(node.childNodes).map(parseNode);
                return React.createElement(node.tagName.toLowerCase(), { key: index, ...props }, ...children);
            }
        }

        return Array.from(parsedDocument.body.childNodes).map(parseNode);
    }

    let massLength = tabs.length;

    return (
        <>
            <div className={classes.tabs}>
                {/* <div className={classes.tabButtons}>
                    {massLength > 1 && tabs.map((tab, index) => (
                        <div
                            key={index}
                            onClick={() => handleTabClick(index)}
                            className={index === activeTab ? `${classes.active}` : ''}
                        >
                            День {index + 1}
                        </div>
                    ))}
                </div> */}
                <div className={classes.tabButtons}>
                    <Swiper
                        slidesPerView={6}
                        spaceBetween={20}
                        loop={false}
                        className={"tourDaysSlider"}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 6,
                            },
                        }}
                    >
                        {massLength > 1 && tabs.map((tab, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    key={index}
                                    onClick={() => handleTabClick(index)}
                                    className={index === activeTab ? `${classes.active} ${classes.tabButton}` : `${classes.tabButton}`}
                                >
                                    День {index + 1}
                                </div>
                                <div
                                    key={index + 12123312}
                                    onClick={() => handleTabClick(index)}
                                    className={classes.tabButtonCircle}
                                >
                                    {index != 0 && <div className={classes.tabButtonCircle_lineLeft} ></div>}
                                    <div className={index === activeTab ? `${classes.activeCircle} ${classes.tabButtonCircle_block}` : `${classes.tabButtonCircle_block}`} ></div>
                                    {index + 1 != tabs.length && <div className={classes.tabButtonCircle_lineRight} ></div>}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div >
                <div className={classes.tabContent}>
                    {parseHTML(tabs[activeTab])}
                </div>
            </div >
        </>
    );
}

export default ToursTab;
