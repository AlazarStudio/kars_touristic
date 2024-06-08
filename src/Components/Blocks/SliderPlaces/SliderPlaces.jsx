import React from "react";
import classes from './SliderPlaces.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import server from '../../../serverConfig'

function SliderPlaces({ children, ...props }) {
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
    
    return (
        <>
            <div className={classes.tour_slider} style={{ boxShadow: props.boxShadow }}>
                <div className={classes.tour_slider__block}>
                    <Swiper
                        navigation={true}
                        modules={[Navigation]}
                        slidesPerView={3}
                        spaceBetween={30}
                        loop={props.loop}
                        className={'checklistSlider'}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {props.info.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className={classes.tourInfo_slide}>
                                    {/* {item ? <div className={classes.tourInfo_slide__title}>{item}</div> : null} */}
                                    {/* {item.text ? <div className={classes.tourInfo_slide__desc}>{parseHTML(item.text)}</div> : null} */}
                                    {item? <div className={classes.tourInfo_slide__img}><img src={`${server}/refs/${item}`} alt="" /></div> : null}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
}

export default SliderPlaces;