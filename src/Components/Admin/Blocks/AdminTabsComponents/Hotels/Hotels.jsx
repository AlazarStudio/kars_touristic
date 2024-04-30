import React from "react";
import classes from './Hotels.module.css';

import { Link, useParams } from "react-router-dom";
import AddHotels from "../AddHotels/AddHotels";

function Hotels({ children, title, type, ...props }) {
    const { add } = useParams();
    return (
        <>
            {!add ?
                <div className={classes.multidayTours}>
                    <div className={classes.multidayTours_back}>
                        <Link to={`/admin/edit/${title}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>

                    <div className={classes.multidayTours_top}>
                        <div className={classes.multidayTours_top__title}>Отели региона</div>
                        <Link to={'addOneday_tour'} className={classes.multidayTours_top__add}>Добавить отель</Link>
                    </div>

                    <div className={classes.multidayTours_data}>
                        <div className={classes.multidayTours_data__tour}>
                            <div className={classes.multidayTours_data__tour___img}>
                                <img src="/object_1.png" alt="" />
                            </div>
                            <div className={classes.multidayTours_data__tour___info}>
                                <div className={classes.multidayTours_data__tour___info____title}>«Нoвогодняя сказка Кавказа»</div>
                            </div>
                            <div className={classes.multidayTours_data__tour___btns}>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}>Удалить</div>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</div>
                            </div>
                        </div>

                        <div className={classes.multidayTours_data__tour}>
                            <div className={classes.multidayTours_data__tour___img}>
                                <img src="/object_1.png" alt="" />
                            </div>
                            <div className={classes.multidayTours_data__tour___info}>
                                <div className={classes.multidayTours_data__tour___info____title}>«Нoвогодняя сказка Кавказа»</div>
                            </div>
                            <div className={classes.multidayTours_data__tour___btns}>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}>Удалить</div>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</div>
                            </div>
                        </div>

                        <div className={classes.multidayTours_data__tour}>
                            <div className={classes.multidayTours_data__tour___img}>
                                <img src="/object_1.png" alt="" />
                            </div>
                            <div className={classes.multidayTours_data__tour___info}>
                                <div className={classes.multidayTours_data__tour___info____title}>«Нoвогодняя сказка Кавказа»</div>
                            </div>
                            <div className={classes.multidayTours_data__tour___btns}>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}>Удалить</div>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</div>
                            </div>
                        </div>

                        <div className={classes.multidayTours_data__tour}>
                            <div className={classes.multidayTours_data__tour___img}>
                                <img src="/object_1.png" alt="" />
                            </div>
                            <div className={classes.multidayTours_data__tour___info}>
                                <div className={classes.multidayTours_data__tour___info____title}>«Нoвогодняя сказка Кавказа»</div>
                            </div>
                            <div className={classes.multidayTours_data__tour___btns}>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}>Удалить</div>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</div>
                            </div>
                        </div>

                        <div className={classes.multidayTours_data__tour}>
                            <div className={classes.multidayTours_data__tour___img}>
                                <img src="/object_1.png" alt="" />
                            </div>
                            <div className={classes.multidayTours_data__tour___info}>
                                <div className={classes.multidayTours_data__tour___info____title}>«Нoвогодняя сказка Кавказа»</div>
                            </div>
                            <div className={classes.multidayTours_data__tour___btns}>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}>Удалить</div>
                                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                        <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>

                    <AddHotels />
                </>
            }
        </>
    );
}

export default Hotels;