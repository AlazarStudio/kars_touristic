import React, { useState } from "react";
import classes from './SliderPlaces.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import server from '../../../serverConfig';

function SliderPlaces({ children, ...props }) {
    const [modalImageIndex, setModalImageIndex] = useState(null);

    const handleImageClick = (index) => {
        setModalImageIndex(index);
    };

    const closeModal = () => {
        setModalImageIndex(null);
    };

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
                                    {item ? (
                                        <div className={classes.tourInfo_slide__img}>
                                            <img 
                                                src={`${server}/refs/${item}`} 
                                                alt="" 
                                                onClick={() => handleImageClick(index)} 
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {modalImageIndex !== null && (
                <div className={classes.modal} onClick={closeModal}>
                    <div className={classes.modal_content} onClick={(e) => e.stopPropagation()}>
                        <span className={classes.modal_close} onClick={closeModal}>&times;</span>
                        <Swiper
                            navigation={true}
                            modules={[Navigation]}
                            initialSlide={modalImageIndex}
                            className={`${classes.modal_swiper} modal-swiper-show-img`}
                            loop={props.loop}
                        >
                            {props.info.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={`${server}/refs/${item}`} 
                                        alt="" 
                                        className={classes.modal_img} 
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
}

export default SliderPlaces;
