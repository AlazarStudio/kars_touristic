import React from "react";
import classes from './Tours.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Tours({ children, ...props }) {
    return (
        <>
            <div className={classes.main}>
                <div className={classes.tour} style={{ backgroundImage: `url('/tour_bg.png')` }}>
                    <CenterBlock>
                        <WidthBlock>
                            <div className={classes.centerPosition}>
                                <div className={classes.tour_topInfo}>
                                    <div className={classes.tour_topInfo__left}>
                                        <div className={classes.tour_topInfo__left___title}>
                                            «Нoвогодняя сказка Кавказа»
                                        </div>
                                        <div className={classes.tour_topInfo__left___items}>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Cпособ передвижения:</div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>Автобусно-пешеходная</div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Продолжительность: </div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>5 д \ 4 н</div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Время отправления:</div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>13:00 ( МСК )</div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Тип экскурсии:</div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>Познавательные</div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Сложность:</div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>Средняя</div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___items____element}>
                                                <div className={classes.tour_topInfo__left___items____element_____title}>Стоимость:</div>
                                                <div className={classes.tour_topInfo__left___items____element_____info}>20 000 ₽</div>
                                            </div>
                                        </div>
                                        <div className={classes.tour_topInfo__left___btn}>
                                            Забронировать тур
                                        </div>
                                    </div>
                                    <div className={classes.tour_topInfo__right}>
                                        <div className={classes.tour_topInfo__right___img}>
                                            <img src="/tour_img.png" alt="" />
                                        </div>
                                        <div className={classes.tour_topInfo__right___places}>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Минеральные воды
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Курорт Домбай
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Гора Эльбрус
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Курорт Домбай
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Гора Эльбрус
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__right___places____place}>
                                                <div className={classes.tour_topInfo__right___places____place_____img}>
                                                    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                            fill="var(--white_color)"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={classes.tour_topInfo__right___places____place_____title}>
                                                    Минеральные воды
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </WidthBlock>
                    </CenterBlock>
                </div>

                <WidthBlock>
                    <div className={classes.tour_slider}>
                        <div className={classes.tour_slider__block}>
                            <Swiper
                                navigation={true}
                                modules={[Navigation]}
                                slidesPerView={3}
                                spaceBetween={30}
                                className={classes.mySwiper}
                            >
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Одежда</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Защита</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Снаряжение</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Одежда</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Защита</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                
                                <SwiperSlide>
                                    <div className={classes.tourInfo_slide}>
                                        <div className={classes.tourInfo_slide__title}>Снаряжение</div>
                                        <div className={classes.tourInfo_slide__desc}>
                                            <ul>
                                                <li>sed do eiusmod tempor incidi</li>
                                                <li>magna aliqua. Ut enim ad minim</li>
                                                <li>exercitation ullamco laboris nisi</li>
                                                <li>commodo consequat. Duis aute</li>
                                                <li>reprehenderit in voluptate velit</li>
                                                <li>fugiat nulla pariatur. Excepteur</li>
                                                <li>non proident, sunt in culpa qui</li>
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </WidthBlock>
            </div>
        </>
    );
}

export default Tours;