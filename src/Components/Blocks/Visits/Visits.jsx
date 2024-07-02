import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from './Visits.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import SliderPlaces from "../SliderPlaces/SliderPlaces";
import H2 from "../../Standart/H2/H2";
import Object from "../Object/Object";
import { Link } from "react-router-dom";

import server from '../../../serverConfig'
function Visits({ children, ...props }) {
    let { id } = useParams();

    const [place, setPlace] = useState();
    const [multidayTours, setMultidayTours] = useState([]);
    const [onedayTours, setOnedayTours] = useState([]);
    const [combinedArray, setCombinedArray] = useState([]);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await fetch(`${server}/api/getOnePlace/${id}`);
                const data = await response.json();
                setPlace(data);
            } catch (error) {
                console.error('Ошибка при загрузке данных о месте:', error);
            }
        };

        fetchPlace();
    }, [id]);

    useEffect(() => {
        const fetchMultidayTours = async () => {
            if (place && place.title) {
                try {
                    const response = await fetch(`${server}/api/getMultidayToursInPlace/${place.title}`);
                    const data = await response.json();
                    setMultidayTours(data.getMultidayToursInPlace);
                } catch (error) {
                    console.error('Ошибка при загрузке многодневных туров:', error);
                }
            }
        };

        fetchMultidayTours();


    }, [place]);

    useEffect(() => {
        const fetchMultidayTours = async () => {
            if (place && place.title) {
                try {
                    const response = await fetch(`${server}/api/getOnedayToursInPlace/${place.title}`);
                    const data = await response.json();
                    setOnedayTours(data.getOnedayToursInPlace);
                } catch (error) {
                    console.error('Ошибка при загрузке многодневных туров:', error);
                }
            }
        };

        fetchMultidayTours();
    }, [place]);


    useEffect(() => {
        if (multidayTours.length && onedayTours.length) {
            setCombinedArray([...multidayTours, ...onedayTours]);
        }
    }, [multidayTours, onedayTours])

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

    regionsName && place ? regionNameData = getTitleByLink(regionsName, place.region) : null

    return (
        <>
            {place ?
                <CenterBlock>
                    <div className={classes.visitMain} style={{ backgroundImage: `url(${server}/refs/${place.mainPhoto})` }}>
                        <WidthBlock>
                            <CenterBlock gap={'40px'}>
                                <div className={classes.tour_topInfo__bread}>
                                    <Link to={'/'}>Главная</Link> / <Link to={`/region/${place.region}`}>{regionNameData}</Link> / {place.title}
                                </div>
                                <H2 text_transform="uppercase" text_align={'center'} font_size="60px" color="var(--white_color)" zIndex="1">{place.title}</H2>

                                <div className={classes.visitBlocks_item_forText}>
                                    {place.description}
                                </div>

                                <Link to={place.mapLink} className={classes.visitButton} target="_blank" style={{ zIndex: '1' }}> <img src="/placePoint.webp" alt="" />Показать на карте</Link>
                            </CenterBlock>
                        </WidthBlock>
                    </div>

                    <WidthBlock>

                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">ГАЛЕРЕЯ</H2>
                        </CenterBlock>

                        <SliderPlaces info={place.photos} boxShadow={'none'} loop={true} />

                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">Информация для туриста</H2>
                        </CenterBlock>

                        <div className={classes.visitBlocks}>

                            {place.placeItems.map((item, index) => (
                                <div className={classes.visitBlocks_item} key={index}>
                                    {/* <div className={classes.visitBlocks_item__img}>
                                        <img src="/visit_img_1.webp" alt="" />
                                    </div> */}
                                    <div className={classes.visitBlocks_item__title}>{item.title}</div>
                                    <div className={classes.visitBlocks_item__desc}>{item.description}</div>
                                </div>
                            ))}
                            {/* <div className={classes.visitBlocks_item}>
                                <div className={classes.visitBlocks_item__img}>
                                    <img src="/visit_img_2.webp" alt="" />
                                </div>
                                <div className={classes.visitBlocks_item__title}>Вулкан, спящий более </div>
                                <div className={classes.visitBlocks_item__desc}><span>5100</span> лет</div>
                            </div>
                            <div className={classes.visitBlocks_item}>
                                <div className={classes.visitBlocks_item__img}>
                                    <img src="/visit_img_3.webp" alt="" />
                                </div>
                                <div className={classes.visitBlocks_item__title}>Со склонов Эльбруса стекают</div>
                                <div className={classes.visitBlocks_item__desc}><span>23</span> ледника</div>
                            </div>
                            <div className={classes.visitBlocks_item}>
                                <div className={classes.visitBlocks_item__img}>
                                    <img src="/visit_img_4.webp" alt="" />
                                </div>
                                <div className={classes.visitBlocks_item__title}>Ледники дают жизнь трем крупным рекам — <b>Кубани, Малку и Баксан</b></div>
                            </div> */}
                        </div>

                        {combinedArray.length > 0 ?
                            <>
                                <CenterBlock>
                                    <H2 text_transform="uppercase" font_size="36px">Туры</H2>
                                </CenterBlock>

                                <div className={classes.similar}>
                                    {
                                        combinedArray.map((item, index) => (
                                            <Object key={index} regionData={item} titleObject={'tourTitle'} />
                                        ))
                                    }
                                </div>
                            </>
                            : null}


                        <br />
                    </WidthBlock>
                </CenterBlock>
                :
                null
            }
        </>
    );
}

export default Visits;