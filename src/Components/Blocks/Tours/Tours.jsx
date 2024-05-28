import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

function Tours({ children, requestType, ...props }) {
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
    }, []);


    const tabs = [
        {
            label: 'День 1', content: `
            <p>— Прибытие на Кавказские Минеральные Воды (аэропорт или железнодорожный вокзал г.Минеральные Воды, или
            железнодорожный вокзал г. Пятигорска), Рекомендованное время прибытия не позднее 11:00 по московскому времени.
            </p><p>
            — Трансфер до гостиницы выбранной категории самостоятельно или по заявке
            за дополнительную плату.
            </p><p>
            — Размещение в выбранной гостинице.
            </p><p>
            — 06ед оплачивается самостоятельно или по заявке за доп. плату.
            </p><p>
            — Встреча с гидом в 13:00 по московскому времени.
            </p><p>
            Обзорная экскурсия по двум городам-курортом Кисловодск и Ессентуки. в ходе которой Вы услышите историю
            открытия вод, историю развития курортной местности, познакомитесь с основными достопримечательностями
            городов, их архитектурными стилями, попробуете воды этих курортов: Ессентуки 17, 4 и знаменитый Кисловодский
            нарзан.
            </p><p>
            Именно благодаря нарзану, известному с давних пор, возник курорт Кисловодск:
            </p><p>
            Гордостью Кисловодско считается курортный парк, получивший статус Национального в 2016году. Это самый
            большой парк Европы, это первый парк Кавказских Минеральных Вод, заложенный в 1823году. Это настоящий
            дендропарк с коллекцией около 300 видов деревьев и кустарников. Вы совершите прогулку по старой части парка, где
            увидите: Зеркальный пруд, Стеклянную струю, Лермонтовскую площадку и Нарзанную галерею.
            </p><p>
            Здание Нарзанной галереи построено в середине 19 века по проекту англичанина
            'СИУлтона, по форме напоминает средневековой рыцарский замок с элементами готики. Внутри здания ключ нарзана
            под стеклянным колпаком. Если посмотреть сверху
            на здание: это ключ над ключом. ПосетивНарзанную галерею, попробуете знаменитый нарзан — напиток богатырей
            </p><p>
            'Отнарзана проследуете к минеральным источникам города-курорта Ессентуки.
            </p><p>
            Это самый молодой курорт Кавказских Минеральных Вод.лотому что по сравнению с другими курортами были оценены его воды.1823 год, профессор
            АП Нелюбин открывает миру уникальные воды Ессентукского курорта: Ессентуки 17 и Ессентуки Амоторый в.
            настоящее время считается одним из лучших бальнеогрязевых курортов по лечению гастроэнтерологических
            заболеваний и обмена веществ.
            </p><p>
            На центральной аллее курортного парка, называемой в честь князя М С.Воронцова, внимание привлекает
             фахверковая конструкция Механотерапии с чудом сохранившимися аппаратами для лечения позвоночника и суставов,
             разработанными скимфизиотерапевтом Г. Цандером. Аппаратам уже более 100лет, на этих аппаратах лечились
            Ф Шаляпин и К Станиславский, снимались Л Гурченко и А Михайловв фильме «Любовь и голуби».
            </p><p>
            Верхнюю часть парка украшает здание Императорских ванн с 1898г. в котором сохранились 7 из 32-х каменных
             ванн из итальянского зеленого мрамора, в которых предполагалось лечение членов императорской семьи
            </p><p>
            "Символом Ессентуки является поистине роскошное здание Грязелечебницы в стиле античного неоклассицизма.
            (древнеримских терм М вн.э)- архитектурный шедевр
            ЕШреттера, построенное в 1915 году. Это одно из красивейших зданий Европы. Перед входом «встречают» боги
            врачевания Асклепий и Гигея, Посейдон, скульптуры львов, символизирующие силу Природы, многочисленные
            ‘барельефы, декоративные вазоны, колонны, поддерживающие портик.    </p>       
        ` },
        { label: 'День 2', content: 'Content for Tab 2' },
        { label: 'День 3', content: 'Content for Tab 3' },
        { label: 'День 4', content: 'Content for Tab 4' },
    ];

    const tours = [
        {
            img: "object_1.png",
            title: "«Нoвогодняя сказка Кавказа»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Черкесск",
            category: "Познавательные",
            date: "2024-04-05",
            tripType: "Групповая поездка",
            link: "novogodnyaya_skazka_kavkaza",
            placeLink: "tours"
        },
        {
            img: "object_2.png",
            title: "«Нoвогодние каникулы на Кавказе»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Карачаевск",
            category: "Гастрономические",
            date: "2024-04-06",
            tripType: "Индивидуальная поездка",
            link: "novogodnie_kanikuly_na_kavkaze",
            placeLink: "tours"
        },
        {
            img: "object_3.png",
            title: "«Нoвогоднее путешествие по Кавказу»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Архыз",
            category: "Конные",
            date: "2024-04-05",
            tripType: "Индивидуальная поездка",
            link: "novogodnee_puteshestvie_po_kavkazu",
            placeLink: "tours"
        },
    ]

    const info = [
        {
            title: 'Одежда',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
        {
            title: 'Защита',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
        {
            title: 'Снаряжение',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
        {
            title: 'Одежда',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
        {
            title: 'Защита',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
        {
            title: 'Снаряжение',
            text: `
            <ul>
                <li>sed do eiusmod tempor incidi</li>
                <li>magna aliqua. Ut enim ad minim</li>
                <li>exercitation ullamco laboris nisi</li>
                <li>commodo consequat. Duis aute</li>
                <li>reprehenderit in voluptate velit</li>
                <li>fugiat nulla pariatur. Excepteur</li>
                <li>non proident, sunt in culpa qui</li>
            </ul>
            `
        },
    ]

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    return (
        <>
            {tour ?
                <div className={classes.main}>
                    <div className={classes.tour} style={{ backgroundImage: `url('/tour_bg.png')` }}>
                        <CenterBlock>
                            <WidthBlock>
                                <div className={classes.centerPosition}>
                                    <div className={classes.tour_topInfo}>
                                        <div className={classes.tour_topInfo__left}>
                                            <div className={classes.tour_topInfo__left___title}>
                                                {tour.tourTitle}
                                            </div>
                                            <div className={classes.tour_topInfo__left___items}>
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
                                            <div className={classes.tour_topInfo__left___btn}>
                                                Добавить в корзину
                                            </div>
                                        </div>
                                        <div className={classes.tour_topInfo__right}>
                                            <div className={classes.tour_topInfo__right___img}>
                                                <Swiper navigation={true} modules={[Navigation]} loop={true} className="tourPhotos">
                                                    {tour.photos.map((item, index) => (
                                                        <SwiperSlide key={index}>
                                                            <img src={`${server}/refs/${item}`} alt="" />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
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
                        <Slider info={info} boxShadow={'0px 4px 46.4px 0px #B4B4B440'} loop={false} />

                        <ToursTab tabs={tabs} />

                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">ОТЗЫВЫ</H2>
                        </CenterBlock>

                        <Feedback />

                        {/*
                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">Популярные туры</H2>
                        </CenterBlock>

                         
                    <div className={classes.similar}>
                        {tours.map((item, index) => (
                            <Object key={index} img={item.img} title={item.title} priceImg={item.priceImg} price={item.price} link={item.link} placeLink={item.placeLink} />
                        ))}
                    </div> */}

                    </WidthBlock>
                </div>
                :
                null
            }
        </>
    );
}

export default Tours;