import React from "react";
import classes from './Hotels.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";
import Feedback from "../Feedback/Feedback";
import SliderHotel from "../SliderHotel/SliderHotel";
import HotelNumber from "../HotelNumber/HotelNumber";

function Hotels({ children, ...props }) {
    let img = '/hotel_bg.png';

    const info = [
        {
            img: 'galery1.png',
        },
        {
            img: 'galery2.png',
        },
        {
            img: 'galery3.png',
        },
        {
            img: 'galery1.png',
        },
        {
            img: 'galery2.png',
        },
        {
            img: 'galery3.png',
        },
    ]

    const numbers = [
        {
            img: 'hotel_number_1.png',
            title: 'Двухместный полулюкс (двуспальный)',
            places: 'до 2 мест',
            size: '18 м²',
            link: "dvuhmestnyj_polulyuks_(dvuspalnyj)"
        },
        {
            img: 'hotel_number_2.png',
            title: 'Двухместный номер с видом',
            places: 'до 2 мест',
            size: '18 м²',
            link: 'dvuhmestnyj_nomer_s_vidom'
        },
        {
            img: 'hotel_number_3.png',
            title: 'Двухместный полулюкс 1 (двуспальный)',
            places: 'до 2 мест',
            size: '18 м²',
            link: 'dvuhmestnyj_polulyuks_1_(dvuspalnyj)'
        },
    ]

    return (
        <>
            <div className={classes.main} style={{ backgroundImage: `url('${img}')` }}>
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.hotelInfo}>
                            <div className={classes.hotelTitle}>GRAND PLAZA HOTEL</div>
                            <div className={classes.hotelDesc}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </div>
                            <div className={classes.hotelStars}>
                                <img src="/starsHotel.png" alt="" />
                            </div>
                        </div>
                    </WidthBlock>
                </CenterBlock>
            </div>

            <CenterBlock>
                <WidthBlock>
                    <div className={classes.hotelItems}>
                        <div className={classes.hotelItems_elem}>
                            <div className={classes.hotelItems_elem__img}>
                                <img src="/calendar.png" alt="" />
                            </div>
                            <div className={classes.hotelItems_elem__title}>365 дней</div>
                            <div className={classes.hotelItems_elem__desc}>
                                Мы работает для Вас круглый год. Зимой, летом, весной, осенью
                            </div>
                        </div>
                        <div className={classes.hotelItems_elem}>
                            <div className={classes.hotelItems_elem__img}>
                                <img src="/nomers.png" alt="" />
                            </div>
                            <div className={classes.hotelItems_elem__title}>50 номеров</div>
                            <div className={classes.hotelItems_elem__desc}>Разных номеров для разных компаний</div>
                        </div>
                        <div className={classes.hotelItems_elem}>
                            <div className={classes.hotelItems_elem__img}>
                                <img src="/dir.png" alt="" />
                            </div>
                            <div className={classes.hotelItems_elem__title}>250 метров</div>
                            <div className={classes.hotelItems_elem__desc}>Ближайший подъемник в шагой доступности для наших гостей</div>
                        </div>
                        <div className={classes.hotelItems_elem}>
                            <div className="hotelItems_elem__img">
                                <img src="/food.png" alt="" />
                            </div>
                            <div className={classes.hotelItems_elem__title}>Отличный завтрак</div>
                            <div className={classes.hotelItems_elem__desc}>Уже включен в стоимость прождивания в нашей гостинице</div>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>

            <div className={classes.aboutHotel}>
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.aboutHotel_info}>
                            <div className={classes.aboutHotel_info__left}>
                                <img src={img} alt="" />
                            </div>
                            <div className={classes.aboutHotel_info__right}>
                                <div className={classes.aboutHotel_info__right___title}>GRAND PLAZA HOTEL</div>
                                <div className={classes.aboutHotel_info__right___text}>
                                    <p>
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p><p>
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p><p>
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </WidthBlock>
                </CenterBlock>
            </div>

            <CenterBlock>
                <WidthBlock>
                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">ГАЛЕРЕЯ</H2>
                    </CenterBlock>

                    <SliderHotel info={info} boxShadow={'none'} loop={true} />

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">НОМЕРА</H2>
                    </CenterBlock>

                    <HotelNumber numbers={numbers} />

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">ОТЗЫВЫ</H2>
                    </CenterBlock>

                    <Feedback />

                    <div className={classes.links}>
                        <a href="#" target="_blank" className={classes.links_item}>
                            <img src="/tg_white.png" alt="" />
                        </a>
                        <a href="#" target="_blank" className={classes.links_item}>
                            <img src="/vk_white.png" alt="" />
                        </a>
                        <a href="#" target="_blank" className={classes.links_item}>
                            <img src="/wa_white.png" alt="" />
                        </a>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Hotels;