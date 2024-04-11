import React from "react";
import classes from './Object.module.css';

function Object({ children, ...props }) {
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
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
                    <a href={`/${props.placeLink}/${props.link}`} className={classes.objects_item__button}>Подробнее</a>
                </div>
            </div>
        </>
    );
}

export default Object;