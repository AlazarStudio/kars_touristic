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

function NumberShow({ children, ...props }) {
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


    return (
        <>
            {room ?
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.numberInfo}>
                            <div className={classes.numberInfo_left}>
                                <div className={`${classes.numberInfo_left__slider} numberSlider`}>
                                    <Swiper navigation={true} modules={[Navigation]} loop={true} className="mySwiper">
                                        {room.photos.map((img, index) => (
                                            <SwiperSlide key={index}><img src={`${server}/refs/${img}`} alt="" /></SwiperSlide>
                                        ))}
                                    </Swiper>
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
                            </div>
                            <div className={classes.numberInfo_right}>
                                <div className={classes.numberInfo_right__title}>
                                    {room.title}
                                </div>
                                <div className={classes.numberInfo_right__desc}>
                                    {room.description}
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
                        {/*<br />
                         <CenterBlock>
                            <H2 text_transform="uppercase" margin="0 0 25px 0">Стоимость</H2>
                            <H2 font_weight="500" margin="0 0 50px 0">Цена меняется в зависимости от сезона. Обратите внимание на даты!</H2>

                            <div className={classes.table}>
                                <div className={classes.table_row}>
                                    <div className={classes.table_row__element}></div>
                                    <div className={classes.table_row__element}>01.04.2023 по 30.06.2023</div>
                                    <div className={classes.table_row__element}>01.07.2023 по 31.08.2023</div>
                                    <div className={classes.table_row__element}>01.09.2023 по 20.11.2023</div>
                                </div>
                                <div className={classes.table_row}>
                                    <div className={classes.table_row__element}>двухместное размещение</div>
                                    <div className={classes.table_row__element}><b>6000</b></div>
                                    <div className={classes.table_row__element}><b>6000</b></div>
                                    <div className={classes.table_row__element}><b>6000</b></div>
                                </div>
                                <div className={classes.table_row}>
                                    <div className={classes.table_row__element}>+ доп место</div>
                                    <div className={classes.table_row__element}><b>1500</b></div>
                                    <div className={classes.table_row__element}><b>3000</b></div>
                                    <div className={classes.table_row__element}><b>1500</b></div>
                                </div>
                            </div>

                            <div className={classes.button}>Оставить заявку</div>
                        </CenterBlock> */}
                    </WidthBlock>
                </CenterBlock>
                :
                null
            }
        </>
    );
}

export default NumberShow;