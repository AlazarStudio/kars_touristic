import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import classes from './Tours.module.css';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import ToursTab from "../ToursTab/ToursTab";
import H2 from "../../Standart/H2/H2";

import Object from "../Object/Object";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import Feedback from "../Feedback/Feedback";
import Slider from "../Slider/Slider";

import server from '../../../serverConfig'

function Tours({ children, requestType, pageName, tableName, similar, ...props }) {
    let { id } = useParams();

    const [tour, setTour] = useState();

    const fetchTour = () => {
        fetch(`${server}/api/${requestType}/${id}`)
            .then(response => response.json())
            .then(data => setTour(data))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchTour();
    }, [id]);

    const [regions, setRegions] = useState([]);

    const fetchData = () => {
        fetch(`${server}/api/${similar}`)
            .then(response => response.json())
            .then(data => setRegions(data[tableName]))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [places, setPlaces] = useState();

    const fetchPlaces = () => {
        fetch(`${server}/api/getPlaces`)
            .then(response => response.json())
            .then(data => setPlaces(data.places))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const foundRegion = regions.filter(region => region.region === tour?.region);

    const renderPlaces = (item) => {
        if (!places || places.length === 0) {
            return <span key={item}>{item}</span>;
        }
        const normalizedItem = item.toLowerCase();
        const matchedPlace = places.find(place => place.title.toLowerCase().includes(normalizedItem));
        return matchedPlace ? (
            <Link to={`/visits/${matchedPlace._id}`} key={matchedPlace._id}>
                {item}
            </Link>
        ) : (
            <span key={normalizedItem}>{item}</span>
        );
    };


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
    regionsName && tour ? regionNameData = getTitleByLink(regionsName, tour.region) : null

    
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        getUserInfo(token)
            .then(userData => setUser(userData))
            .catch(error => console.error('Error initializing user:', error));
    }, [token]);

    const navigate = useNavigate();

    const getUserInfo = async (token) => {
        if (token) {
            try {
                const response = await fetch(`${server}/api/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    return await response.json();
                } else {
                    throw new Error('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                throw error;
            }
        }
    };

    const updateUser = async (token, updates) => {
        try {
            const response = await fetch(`${server}/api/userUpdate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) {
                throw new Error('Failed to update user.');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const handleAddCartClick = async () => {
        if (token) {
            const updates = {
                cart: [id]
            };

            try {
                const updatedUser = await updateUser(token, updates);
                setUser(updatedUser);
                alert(updatedUser.message ? updatedUser.message : updatedUser);
                window.location.reload();
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            alert('Вы не авторизованы');
            navigate('/signIn');
        }
    };

    return (
        <>
            {tour ?
                <div className={classes.main}>
                    <div className={classes.tour} style={{ backgroundImage: `url('${server}/refs/${tour.mainPhoto}')` }}>
                        <CenterBlock>
                            <WidthBlock>
                                <div className={classes.centerPosition}>
                                    <div className={classes.tour_topInfo__bread}>
                                        <Link to={'/'}>Главная</Link> / <Link to={`/region/${tour.region}`}>{regionNameData}</Link> / {tour.tourTitle}
                                    </div>

                                    <div className={classes.tour_topInfo__left___title}>
                                        {tour.tourTitle}
                                    </div>
                                    <div className={classes.tour_topInfo}>
                                        <div className={classes.tour_topInfo__left}>
                                            <div className={classes.tour_topInfo__left___items}>
                                                {tour.author &&
                                                    <div className={classes.tour_topInfo__left___items____elementAuthor}>
                                                        <div className={classes.tour_topInfo__left___items____element_____info}>Автор тура: {tour.author}</div>
                                                    </div>
                                                }

                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Cпособ передвижения:</div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.travelMethod}</div>
                                                </div>
                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Продолжительность: </div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.duration}</div>
                                                </div>
                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Время отправления:</div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.departureTime}</div>
                                                </div>
                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Тип экскурсии:</div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.tourType}</div>
                                                </div>
                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Сложность:</div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.difficulty}</div>
                                                </div>
                                                <div className={classes.tour_topInfo__left___items____element}>
                                                    <div className={classes.tour_topInfo__left___items____element_____title}>Стоимость:</div>
                                                    <div className={classes.tour_topInfo__left___items____element_____info}>{tour.cost}</div>
                                                </div>
                                            </div>
                                            <div className={classes.tour_topInfo__left___btn} onClick={handleAddCartClick}>
                                                {user && user.cart && user.cart.includes(id) ? 'В корзине' : 'Добавить в корзину'}
                                            </div>
                                        </div>
                                        <div className={classes.tour_topInfo__right}>
                                            <div className={classes.tour_topInfo__right___img}>
                                                <Swiper navigation={true} modules={[Navigation]} loop={true} className="tourPhotos">
                                                    {tour.photos.map((item, index) => (
                                                        // item != tour.mainPhoto ?
                                                        <SwiperSlide key={index}>
                                                            <img src={`${server}/refs/${item}`} alt="" />
                                                        </SwiperSlide>
                                                        // : null
                                                    ))}
                                                </Swiper>
                                            </div>

                                            <div className={classes.tour_topInfo__right___places_gradient}>
                                                <div className={classes.tour_topInfo__right___places}>
                                                    {tour.places.map((item, index) => (
                                                        <div className={classes.tour_topInfo__right___places____place} key={index}>
                                                            <div className={classes.tour_topInfo__right___places____place_____img}>
                                                                <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                                                        fill="var(--black_color)"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className={classes.tour_topInfo__right___places____place_____title}>
                                                                {renderPlaces(item)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </WidthBlock>
                        </CenterBlock>
                    </div>

                    <WidthBlock>
                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">Чек-Лист</H2>
                        </CenterBlock>

                        <Slider info={tour.checklists} boxShadow={'0px 4px 46.4px 0px #B4B4B440'} loop={false} />

                        <ToursTab tabs={tour.days} />

                        {/* <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">ОТЗЫВЫ</H2>
                        </CenterBlock>

                        <Feedback /> */}

                        {foundRegion.length > 1 ?
                            <>
                                <CenterBlock>
                                    <H2 text_transform="uppercase" font_size="36px">Похожие туры</H2>
                                </CenterBlock>

                                <div className={classes.similar}>
                                    <div className={classes.similarBlock}>
                                        <Swiper
                                            navigation={true}
                                            modules={[Navigation]}
                                            slidesPerView={2}
                                            spaceBetween={30}
                                            className={'similarTours'}
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
                                            {foundRegion.map((item, index) => (
                                                item._id != id ?
                                                    <SwiperSlide key={index}>
                                                        <Object width={'100%'} regionData={item} titleObject={'tourTitle'} pageName={pageName} />
                                                    </SwiperSlide>
                                                    : null
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </>
                            : null
                        }

                        <br />
                    </WidthBlock>
                </div>
                :
                null
            }
        </>
    );
}

export default Tours;