import React from "react";
import classes from './HotelNumber.module.css';
import { Link } from "react-router-dom";

function HotelNumber({ children, ...props }) {
    return (
        <>
            <div className={classes.hotelNumbers}>
                {props.numbers.map((item, index) => (
                <div className={classes.hotelNumbers_item} key={index}>
                    <div className={classes.hotelNumbers_item__img}>
                        <img src={`/${item.img}`} alt="" />
                    </div>
                    <div className={classes.hotelNumbers_item__bottom}>
                        <div className={classes.hotelNumbers_item__bottom___title}>{item.title}</div>
                        <div className={classes.hotelNumbers_item__bottom___feedback}>
                            <Link to={"#"} className={classes.hotelNumbers_item__bottom___feedback____item}>Отзывы</Link>
                            <Link to={"#"}  className={classes.hotelNumbers_item__bottom___feedback____item}>Смотреть все</Link>
                        </div>
                        <div className={classes.hotelNumbers_item__bottom___infoBlocks}>
                            <div className={classes.hotelNumbers_item__bottom___infoBlocks____block}>
                                <img src="/peoples.png" alt="" />
                                <div className={classes.hotelNumbers_item__bottom___infoBlocks____block_____title}>{item.places}</div>
                            </div>
                            <div className={classes.hotelNumbers_item__bottom___infoBlocks____block}>
                                <img src="/size.png" alt="" />
                                <div className={classes.hotelNumbers_item__bottom___infoBlocks____block_____title}>{item.size}</div>
                            </div>
                        </div>
                        <Link to={"#"} className={classes.hotelNumbers_item__bottom___button}>Подробнее</Link>
                    </div>
                </div>
                ))}
            </div>
        </>
    );
}

export default HotelNumber;