import React from "react";
import classes from './HotelNumber.module.css';
import { Link } from "react-router-dom";
import server from '../../../serverConfig';

function HotelNumber({ children, handleOpen, isSimillar, ...props }) {
    console.log(props.numbers);
    
    return (
        <>
            <div className={classes.hotelNumbers}>
                {props.numbers.map((item, index) => (
                    <Link to={item._id} className={classes.hotelNumbers_item} key={index} onClick={() => handleOpen(item._id, true)}>
                        <div className={classes.hotelNumbers_item__img}>
                            <img src={`${server}/refs/${item.mainPhoto}`} alt="" />
                        </div>
                        <div className={classes.hotelNumbers_item__bottom}>
                            <div className={classes.hotelNumbers_item__bottom___title}>{item.title}</div>
                            <div className={classes.hotelNumbers_item__bottom___infoBlocks}>
                                <div className={classes.hotelNumbers_item__bottom___infoBlocks_text}>
                                    <div className={classes.hotelNumbers_item__bottom___infoBlocks____block}>{item.places} гостя</div>
                                    <div className={classes.hotelNumbers_item__bottom___infoBlocks____block}>{item.bed} кровати</div>
                                    <div className={classes.hotelNumbers_item__bottom___infoBlocks____block}>{item.square} м²</div>
                                </div>

                                <div className={classes.hotelNumbers_item__bottom___infoBlocks}>
                                    <div className={classes.hotelNumbers_item__bottom___infoBlocks____price}>
                                        {Number(item.price).toLocaleString('ru-RU')} ₽
                                        <span>за сутки</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div >
        </>
    );
}

export default HotelNumber;