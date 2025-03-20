import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

import classes from './NumberShow.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";

import server from '../../../serverConfig'
import Add_Feedback from "../Add_Feedback/Add_Feedback";
import Feedback from "../Feedback/Feedback";

function NumberShow({ children, user, ...props }) {
    const [room, setRoom] = useState();

    let { idRoom } = useParams();

    const fetchRoom = () => {
        fetch(`${server}/api/getOneRoom/${idRoom}`)
            .then(response => response.json())
            .then(data => setRoom(data))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRoom();
    }, []);

    console.log(room)

    return (
        <>
            {room ?
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.room}>
                            <div className={classes.numberInfo}>
                                <div className={classes.roomTitle}>
                                    <div className={classes.roomTitle_title}>
                                        {room.title}
                                    </div>
                                    <div className={classes.roomInfoData}>
                                        <div className={classes.roomInfoData_rating}>4.5 <img src="/starYellow.png" alt="" /></div>
                                        <div className={classes.roomInfoData_feedback}>10 отзывов</div>
                                        <div className={classes.roomInfoData_adress}>Измайловское шоссе, 71к4Г-Д</div>
                                        <div className={classes.roomInfoData_button}>Показать на карте</div>
                                    </div>
                                </div>

                                <div className={classes.numberInfo_left}>
                                    <div className={`${classes.numberInfo_left__slider} numberSlider`}>
                                        <Swiper navigation={true} modules={[Navigation]} loop={false} className="mySwiper">
                                            {room.photos.map((img, index) => (
                                                <SwiperSlide key={index}><img src={`${server}/refs/${img}`} alt="" /></SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    <div className={classes.numberInfo_bron}>
                                        <div className={classes.numberInfo_bron_dop}>
                                            <img src="/heart.png" alt="" /> В избранное
                                        </div>
                                        <div className={classes.numberInfo_bron_calendar}>
                                            Календарь
                                        </div>
                                        <div className={classes.numberInfo_bron_service}>
                                            <span>Служба бронирования:</span>
                                            <a href="tel:+70000000000">+7 (000) 000-00-00</a>
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.numberInfo_right}>
                                    <div className={classes.numberInfo_right__title}>
                                        {room.title}
                                    </div>
                                    <div className={classes.numberInfo_right__desc}>
                                        {room.description}
                                    </div>

                                    <div className={classes.numberInfo_left__desc}>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Площадь</p>
                                            <p>{room.square} м2</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Кровать</p>
                                            <p>{room.bed}</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Дополнительно</p>
                                            <p>{room.additionally}</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Уборка</p>
                                            <p>{room.cleaning}</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Смена белья</p>
                                            <p>{room.changeOfLinen}</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Питание</p>
                                            <p>{room.food}</p>
                                        </div>
                                        <div className={classes.numberInfo_left__desc___item}>
                                            <p>Вид</p>
                                            <p>{room.type}</p>
                                        </div>
                                    </div>
                                    <div className={classes.numberInfo_right__desc___items}>
                                        <div className={classes.numberInfo_right__desc___items____block}>
                                            <div className={classes.numberInfo_right__desc___items____block_____title}>В номере:</div>
                                            <div className={classes.numberInfo_right__desc___items____block____elements}>
                                                {room.inRoom.map((item, index) => (
                                                    <div key={index}><p><img src="/yes.webp" alt="" /></p><span>{item}</span></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={classes.numberInfo_right__desc___items____block}>
                                            <div className={classes.numberInfo_right__desc___items____block_____title}>Принадлежности:</div>
                                            <div className={classes.numberInfo_right__desc___items____block____elements}>
                                                {room.inRoom.map((item, index) => (
                                                    <div key={index}><p><img src="/yes.webp" alt="" /></p><span>{item}</span></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CenterBlock>
                                <H2 text_transform="uppercase" font_size="36px">ОТЗЫВЫ</H2>
                            </CenterBlock>

                            {user && <Add_Feedback />}

                            <Feedback />
                        </div>
                    </WidthBlock>
                </CenterBlock>
                :
                null
            }
        </>
    );
}

export default NumberShow;