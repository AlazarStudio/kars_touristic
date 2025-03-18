import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classes from './Events.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import SliderPlaces from "../SliderPlaces/SliderPlaces";
import H2 from "../../Standart/H2/H2";
import Map from "../Map/Map";

import server from '../../../serverConfig';
import Transfer from "../Transfer/Transfer";
function Events({ children, ...props }) {
    let { idTour } = useParams();

    const [event, setEvent] = useState();
    const [transferInfo, setTransferInfo] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`${server}/api/getOneEvent/${idTour}`);
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Ошибка при загрузке данных о месте:', error);
            }
        };

        fetchEvent();
    }, [idTour]);


    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/transfer`);
                const data = await response.json();
                setTransferInfo(data);
            } catch (error) {
                console.error("Error fetching transfer info:", error);
            }
        }

        fetchMissionInfo();
    }, []);


    return (
        <>
            {event ?
                <CenterBlock>
                    <div className={classes.visitMain} style={{ backgroundImage: `url(${server}/refs/${event.mainPhoto})` }}>
                        <H2 text_transform="uppercase" font_size="40px" color="var(--white_color)" zIndex="1">{event.title}</H2>
                        <a href={event.mapLink} target="_blank" className={classes.placePoint}>
                            <img src="/placePoint.webp" alt="" />
                            Показать на карте
                        </a>
                    </div>
                    <WidthBlock>
                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">{event.title}</H2>
                            <div className={classes.textEvent}>{event.description}</div>
                        </CenterBlock>

                        <CenterBlock>
                            <H2 text_transform="uppercase" font_size="36px">ГАЛЕРЕЯ</H2>
                        </CenterBlock>

                        <SliderPlaces info={event.photos} boxShadow={'none'} loop={true} />

                        {transferInfo ? <Transfer data={transferInfo} /> : null}
                    </WidthBlock>

                    {/* <Map
                    place='https://yandex.ru/map-widget/v1/?ll=42.587183%2C43.884185&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNDk5MDYxMjI4EpgB0KDQvtGB0YHQuNGPLCDQmtCw0YDQsNGH0LDQtdCy0L4t0KfQtdGA0LrQtdGB0YHQutCw0Y8g0KDQtdGB0L_Rg9Cx0LvQuNC60LAsINCc0LDQu9C-0LrQsNGA0LDRh9Cw0LXQstGB0LrQuNC5INGA0LDQudC-0L0sINCc0LXQtNC-0LLRi9C1INCS0L7QtNC-0L_QsNC00YsiCg1TWipCFcGJL0I%2C&z=18.52'
                /> */}
                </CenterBlock>
                :
                null
            }
        </>
    );
}

export default Events;