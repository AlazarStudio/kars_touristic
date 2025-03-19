import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import classes from './Hotels.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";
import Feedback from "../Feedback/Feedback";
import SliderHotel from "../SliderHotel/SliderHotel";
import HotelNumber from "../HotelNumber/HotelNumber";
import ReactModal from 'react-modal';
import Calendar from "../Calendar/Calendar";

import server from '../../../serverConfig';
import Add_Feedback from "../Add_Feedback/Add_Feedback";

ReactModal.setAppElement('#root');

function Hotels({ children, handleOpen, isSimillar, user, ...props }) {
    let img = '/hotel_bg.webp';

    let { idTour, idRoom } = useParams();

    const [hotel, setHotel] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchHotel = () => {
        fetch(`${server}/api/getOneHotel/${idTour}`)
            .then(response => response.json())
            .then(data => setHotel(data))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchHotel();
    }, []);

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch(`${server}/api/getRooms?hotelId=${idTour}`)
            .then(response => response.json())
            .then(data => {
                const sortedTours = data.rooms.sort((a, b) => a.order - b.order);
                setRooms(sortedTours);
            })
            .catch(error => console.error('Ошибка:', error));
    }, [idTour]);

    function getStars(number) {
        let stars = '';
        for (let i = 0; i < number; i++) {
            stars += `<img src="/starYellow.png" alt="" />`;
        }

        return stars;
    }

    const [regionsName, setRegionsName] = useState();

    const fetchRegionsName = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => setRegionsName(data.regions))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegionsName();
    }, []);


    function getTitleByLink(regions, targetLink) {
        const region = regions.find(region => region.link === targetLink);
        return region ? region.title : null;
    }

    let regionNameData = '';

    regionsName && hotel ? regionNameData = getTitleByLink(regionsName, hotel.region) : null


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {hotel ?
                <>
                    <div className={classes.main} style={{ backgroundImage: `url('${server}/refs/${hotel.mainPhoto ? hotel.mainPhoto : hotel.galery[0]}')` }}>
                        <CenterBlock>
                            <WidthBlock>
                                <div className={classes.separateBlock}>
                                    <div className={classes.hotelInfo}>
                                        {/* <div className={classes.tour_topInfo__bread}>
                                            <Link to={'/'}>Главная</Link> / <Link to={`/region/${hotel.region}`}>{regionNameData}</Link> / {hotel.title}
                                        </div> */}
                                        <div className={classes.hotelTitle}>{hotel.title} ({hotel.city})</div>

                                        <div className={classes.hotelDesc}>{hotel.description}</div>

                                        <div className={classes.hotelInfo_stars_links}>
                                            <div className={classes.hotelStars} dangerouslySetInnerHTML={{ __html: getStars(hotel.stars) }}></div>

                                            <div className={classes.links}>
                                                {hotel.links.map((item, index) => (
                                                    <a key={index} href={`${item}`} target="_blank" className={classes.links_item}>
                                                        {/* <img src="/tg_white.webp" alt="" /> */}
                                                        {item.includes("t.me") == true ?
                                                            <img src="/tg_white.webp" alt="" />
                                                            :
                                                            item.includes("wa.me") == true ?
                                                                <img src="/wa_white.webp" alt="" />
                                                                :
                                                                item.includes("vk") == true ?
                                                                    <img src="/vk_white.webp" alt="" />
                                                                    :
                                                                    <img src="/website.png" alt="" />
                                                        }
                                                    </a>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={classes.hotelBron} onClick={openModal}>Забронировать</div>


                                        {/* Модальное окно */}
                                        <ReactModal
                                            isOpen={isModalOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Бронирование номера"
                                            className={classes.modal}
                                            overlayClassName={classes.overlay}
                                        >
                                            <Calendar closeModal={closeModal} hotel={hotel} rooms={rooms} />
                                            <button onClick={closeModal} className={classes.modalCloseButton}>&#x2715;</button>
                                        </ReactModal>
                                    </div>
                                </div>
                            </WidthBlock>
                        </CenterBlock>
                    </div>

                    <CenterBlock>
                        <WidthBlock>
                            <div className={classes.hotelItems}>
                                {hotel.items.map((item, index) => (
                                    <div key={index} className={classes.hotelItems_elem}>
                                        {/* <div className={classes.hotelItems_elem__img}>
                                            <img src="/calendar.webp" alt="" />
                                        </div> */}
                                        <div className={classes.hotelItems_elem__title}>{item.title}</div>
                                        <div className={classes.hotelItems_elem__desc}>{item.description}</div>
                                    </div>
                                ))}


                                {/* <div className={classes.hotelItems_elem}>
                                    <div className={classes.hotelItems_elem__img}>
                                        <img src="/nomers.webp" alt="" />
                                    </div>
                                    <div className={classes.hotelItems_elem__title}>50 номеров</div>
                                    <div className={classes.hotelItems_elem__desc}>Разных номеров для разных компаний</div>
                                </div>
                                <div className={classes.hotelItems_elem}>
                                    <div className={classes.hotelItems_elem__img}>
                                        <img src="/dir.webp" alt="" />
                                    </div>
                                    <div className={classes.hotelItems_elem__title}>250 метров</div>
                                    <div className={classes.hotelItems_elem__desc}>Ближайший подъемник в шагой доступности для наших гостей</div>
                                </div>
                                <div className={classes.hotelItems_elem}>
                                    <div className="hotelItems_elem__img">
                                        <img src="/food.webp" alt="" />
                                    </div>
                                    <div className={classes.hotelItems_elem__title}>Отличный завтрак</div>
                                    <div className={classes.hotelItems_elem__desc}>Уже включен в стоимость проживания в нашей гостинице</div>
                                </div> */}
                            </div>
                        </WidthBlock>
                    </CenterBlock>

                    <div className={classes.aboutHotel}>
                        <CenterBlock>
                            <WidthBlock>
                                <div className={classes.aboutHotel_info}>
                                    <div className={classes.aboutHotel_info__left}>
                                        <img src={`${server}/refs/${hotel.mainPhoto ? hotel.mainPhoto : hotel.galery[0]}`} alt="" />
                                    </div>
                                    <div className={classes.aboutHotel_info__right}>
                                        <div className={classes.aboutHotel_info__right___title}>{hotel.title}</div>
                                        <div className={classes.aboutHotel_info__right___text}>{hotel.moreInfo}</div>
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

                            <SliderHotel info={hotel.galery} boxShadow={'none'} loop={true} />

                            {rooms.length > 0 ?
                                <>
                                    <CenterBlock>
                                        <H2 text_transform="uppercase" font_size="36px">НОМЕРА</H2>
                                    </CenterBlock>

                                    <HotelNumber numbers={rooms} handleOpen={handleOpen} isSimillar={false} />
                                </>
                                :
                                null
                            }

                            <CenterBlock>
                                <H2 text_transform="uppercase" font_size="36px">ОТЗЫВЫ</H2>
                            </CenterBlock>

                            {user && <Add_Feedback />}

                            <Feedback />

                            <br />

                        </WidthBlock>
                    </CenterBlock>
                </>
                :
                null
            }
        </>
    );
}

export default Hotels;