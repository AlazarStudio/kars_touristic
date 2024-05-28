import React from "react";
import classes from './Object.module.css';
import { Link } from "react-router-dom";

import server from '../../../serverConfig'

function Object({ children, pageName, ...props }) {
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    }

    function toTop() {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    return (
        <>
            <div className={classes.objects_item} style={{width: props.width}}>
                <div className={classes.objects_item__img}>
                    <img src={`${server}/refs/${props.regionData.photos[0]}`} alt="" />
                </div>
                <div className={classes.objects_item__bottom}>
                    <div className={classes.objects_item__title}>
                        {truncateString(props.regionData.tourTitle, 33)}
                    </div>
                    <div className={classes.objects_item__price}>
                        <img src={`/${props.regionData.priceImg}`} alt="" />
                        {props.cost}
                    </div>
                    <Link to={`/${pageName}/${props.regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                </div>
            </div>
        </>
    );
}

export default Object;