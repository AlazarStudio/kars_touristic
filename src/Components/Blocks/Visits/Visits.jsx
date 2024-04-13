import React from "react";
import classes from './Visits.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import Slider from "../Slider/Slider";
import H2 from "../../Standart/H2/H2";
import Object from "../Object/Object";
import Map from "../Map/Map";

function Visits({ children, ...props }) {
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
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.visitMain} style={{ backgroundImage: `url(/visitMainImg.png)` }}>
                        <H2 text_transform="uppercase" font_size="40px" color="var(--white_color)" zIndex="1">ГОРА ЭЛЬБРУС</H2>
                    </div>

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">Туры</H2>
                    </CenterBlock>

                    <div className={classes.similar}>
                        {
                            tours.map((item, index) => (
                                <Object key={index} img={item.img} title={item.title} priceImg={item.priceImg} price={item.price} link={item.link} placeLink={item.placeLink} />
                            ))
                        }
                    </div>

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">ГОРА ЭЛЬБРУС</H2>
                        <H2 font_size="16px" font_weight="400" text_align="center" width="80%" margin="35px 0 0 0">Эльбру́с (карач.-балк. Минги-Тау, кабард.-черк. Iуащхьэмахуэ) — стратовулкан на Кавказе (5642 метра над уровнем моря) — самая высокая горная вершина России и Европы при условии проведения границы между Европой и Азией по Главному Кавказскому хребту или южнее (в иных случаях высочайшей вершиной Европы считается альпийская гора Монблан). Эльбрус включён в список высочайших вершин частей света «Семь вершин».</H2>
                    </CenterBlock>

                    <div className={classes.visitBlocks}>
                        <div className={classes.visitBlocks_item}>
                            <div className={classes.visitBlocks_item__img}>
                                <img src="/visit_img_1.png" alt="" />
                            </div>
                            <div className={classes.visitBlocks_item__title}>Две вершины высотой в</div>
                            <div className={classes.visitBlocks_item__desc}><span>5642</span> и <span>5621</span></div>
                        </div>
                        <div className={classes.visitBlocks_item}>
                            <div className={classes.visitBlocks_item__img}>
                                <img src="/visit_img_2.png" alt="" />
                            </div>
                            <div className={classes.visitBlocks_item__title}>Вулкан, спящий более </div>
                            <div className={classes.visitBlocks_item__desc}><span>5100</span> лет</div>
                        </div>
                        <div className={classes.visitBlocks_item}>
                            <div className={classes.visitBlocks_item__img}>
                                <img src="/visit_img_3.png" alt="" />
                            </div>
                            <div className={classes.visitBlocks_item__title}>Со склонов Эльбруса стекают</div>
                            <div className={classes.visitBlocks_item__desc}><span>23</span> ледника</div>
                        </div>
                        <div className={classes.visitBlocks_item}>
                            <div className={classes.visitBlocks_item__img}>
                                <img src="/visit_img_4.png" alt="" />
                            </div>
                            <div className={classes.visitBlocks_item__title}>Ледники дают жизнь трем крупным рекам — <b>Кубани, Малку и Баксан</b></div>
                        </div>
                    </div>

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">ГАЛЕРЕЯ</H2>
                    </CenterBlock>

                    <Slider info={info} boxShadow={'none'} loop={true} />
                </WidthBlock>

                <Map
                    place = 'https://yandex.ru/map-widget/v1/?ll=42.479291%2C43.342236&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNTUxMjA0ODcwEmPQoNC-0YHRgdC40Y8sINCa0LDQsdCw0YDQtNC40L3Qvi3QkdCw0LvQutCw0YDRgdC60LDRjyDQoNC10YHQv9GD0LHQu9C40LrQsCwg0LPQvtGA0LAg0K3Qu9GM0LHRgNGD0YEiCg0V3SlCFVphLUI%2C&z=12.63'
                />
            </CenterBlock>
        </>
    );
}

export default Visits;