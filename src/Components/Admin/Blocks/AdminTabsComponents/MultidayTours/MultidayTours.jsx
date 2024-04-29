import React from "react";
import classes from './MultidayTours.module.css';

import { Link } from "react-router-dom";

function MultidayTours({ children, title, type, ...props }) {
    return (
        <>
            <div className={classes.multidayTours}>
                <div className={classes.multidayTours_back}>
                    <Link to={`/admin/edit/${title}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                </div>

                <div className={classes.multidayTours_top}>
                    <div className={classes.multidayTours_top__title}>Туры региона</div>
                    <div className={classes.multidayTours_top__add}>Добавить тур</div>
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
        </>
    );
}

export default MultidayTours;