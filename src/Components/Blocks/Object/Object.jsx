import React from "react";
import classes from './Object.module.css';
import { Link } from "react-router-dom";

import server from '../../../serverConfig'

function Object({ children, pageName, titleObject, ...props }) {
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

                    {titleObject != 'title' ?
                        <>
                            <div className={classes.objects_item__title}>
                                {truncateString(props.regionData[`${titleObject}`], 50)}
                            </div>
                            <div className={classes.objects_item__desc}>
                                <div>Cпособ передвижения: <span>{props.regionData[`travelMethod`]}</span></div>
                                <div>Продолжительность: <span>{props.regionData[`duration`]}</span></div>
                                <div>Время отправления: <span>{props.regionData[`departureTime`]}</span></div>
                                <div>Тип экскурсии: <span>{props.regionData[`tourType`]}</span></div>
                                <div>Сложность: <span>{props.regionData[`difficulty`]}</span></div>
                            </div>
                            
                            {props.regionData[`optional`] ?
                                <div className={classes.objects_item__optional}>
                                    <img src="/optional.png" alt="" /> {props.regionData[`optional`]}
                                </div>
                                : null
                            }

                            <div className={classes.objects_item__price}>
                                <div>Стоимость: <span>от 20 000*</span></div>
                            </div>

                            <div className={classes.buttons}>
                                <Link to={`/${pageName ? pageName : pageNameVisit}/${props.regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                                <Link to={``} className={`${classes.objects_item__button} ${classes.objects_item__bron}`} >Забронировать</Link>
                            </div>
                        </>
                        :
                        <>
                            <div className={classes.objects_item__title} style={{ textAlign: 'center' }}>
                                {truncateString(props.regionData[`${titleObject}`], 50)}
                            </div>
                            <Link to={`/${pageName ? pageName : pageNameVisit}/${props.regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                        </>
                    }


                </div>
            </div>
        </>
    );
}

export default Object;