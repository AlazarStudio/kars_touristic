import React from "react";
import classes from './Object.module.css';
import { Link } from "react-router-dom";

import server from '../../../serverConfig'

function Object({ children, pageName, titleObject, ...props }) {
    console.log(props.regionData);
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    }

    let pageNameVisit = '';

    if (props.regionData.days) {
        if (props.regionData.days.length > 1) {
            pageNameVisit = 'tours'
        }
        if (props.regionData.days.length <= 1) {
            pageNameVisit = 'excursions'
        }
    }

    function toTop() {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }



    return (
        <>
            <div className={classes.objects_item} style={{ width: props.width }}>
                <div className={classes.objects_item__img}>
                    <img src={`${server}/refs/${props.regionData.mainPhoto ? props.regionData.mainPhoto : props.regionData.photos[0]}`} alt="" />
                </div>
                <div className={classes.objects_item__bottom}>
                    <div className={classes.objects_item__title}>
                        {truncateString(props.regionData[`${titleObject}`], 50)}
                    </div>
                    <div className={classes.objects_item__desc}>
                        <div>Cпособ передвижения: <span>{truncateString(props.regionData[`travelMethod`], 50)}</span></div>
                        <div>Продолжительность: <span>{truncateString(props.regionData[`duration`], 50)}</span></div>
                        <div>Время отправления: <span>{truncateString(props.regionData[`departureTime`], 50)}</span></div>
                        <div>Тип экскурсии: <span>{truncateString(props.regionData[`tourType`], 50)}</span></div>
                        <div>Сложность: <span>{truncateString(props.regionData[`difficulty`], 50)}</span></div>
                        {/* <div>Цена: <span>{truncateString(props.regionData[`cost`], 50)}</span></div> */}
                    </div>
                    <div className={classes.objects_item__price}>
                        <div>Стоимость: <span>от 20 000</span></div>
                    </div>

                    <div className={classes.buttons}>
                        <Link to={`/${pageName ? pageName : pageNameVisit}/${props.regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                        <Link to={``} className={`${classes.objects_item__button} ${classes.objects_item__bron}`} >Забронировать</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Object;