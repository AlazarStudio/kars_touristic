import React from "react";
import classes from './Object.module.css';
import { Link } from "react-router-dom";

function Object({ children, ...props }) {
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    }

    function toTop(){
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    return (
        <>
            <div className={classes.objects_item}>
                <div className={classes.objects_item__img}>
                    <img src={`/${props.img}`} alt="" />
                </div>
                <div className={classes.objects_item__bottom}>
                    <div className={classes.objects_item__title}>
                        {truncateString(props.title, 33)}
                    </div>
                    <div className={classes.objects_item__price}>
                        <img src={`/${props.priceImg}`} alt="" />
                        {props.price}
                    </div>
                    <Link to={`/${props.placeLink}/${props.link}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                </div>
            </div>
        </>
    );
}

export default Object;