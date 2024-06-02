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
                    <div className={classes.objects_item__title}>
                        {/* {truncateString(, 33)} */}
                        {truncateString(props.regionData[`${titleObject}`], 50)}
                    </div>
                    <div className={classes.objects_item__price}>
                        <img src={`/${props.regionData.priceImg}`} alt="" />
                        {props.cost}
                    </div>
                    <Link to={`/${pageName ? pageName : pageNameVisit}/${props.regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                </div>
            </div>
        </>
    );
}

export default Object;