import React from "react";
import classes from './Feedback.module.css';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

function Feedback({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={`${classes.tour_slider} ${classes.feedback}`}>
                        <div className={classes.tour_slider__block}>
                            <Swiper
                                navigation={true}
                                modules={[Navigation]}
                                slidesPerView={2}
                                spaceBetween={30}
                                className={`${classes.mySwiper} feedback`}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                    },
                                }}
                            >
                                <SwiperSlide>
                                    <div className={classes.feedback_slide}>
                                        <div className={classes.feedback_slide__top}>
                                            <div className={classes.feedback_slide__top___img}>
                                                <img src="/feedback_photo.png" alt="" />
                                            </div>
                                            <div className={classes.feedback_slide__top___name}>Иван Иванов</div>
                                            <div className={classes.feedback_slide__top___stars}>
                                                <img src="/rating_all.png" alt="" />
                                            </div>
                                        </div>
                                        <div className={classes.feedback_slide__bottom}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut Duis aute irure dolor
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className={classes.feedback_slide}>
                                        <div className={classes.feedback_slide__top}>
                                            <div className={classes.feedback_slide__top___img}>
                                                <img src="/feedback_photo.png" alt="" />
                                            </div>
                                            <div className={classes.feedback_slide__top___name}>Иван Иванов</div>
                                            <div className={classes.feedback_slide__top___stars}>
                                                <img src="/rating_all.png" alt="" />
                                            </div>
                                        </div>
                                        <div className={classes.feedback_slide__bottom}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut Duis aute irure dolor
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className={classes.feedback_slide}>
                                        <div className={classes.feedback_slide__top}>
                                            <div className={classes.feedback_slide__top___img}>
                                                <img src="/feedback_photo.png" alt="" />
                                            </div>
                                            <div className={classes.feedback_slide__top___name}>Иван Иванов</div>
                                            <div className={classes.feedback_slide__top___stars}>
                                                <img src="/rating_all.png" alt="" />
                                            </div>
                                        </div>
                                        <div className={classes.feedback_slide__bottom}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut Duis aute irure dolor
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Feedback;