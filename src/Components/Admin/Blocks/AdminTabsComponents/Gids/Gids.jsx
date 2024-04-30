import React from "react";
import classes from './Gids.module.css';

import { Link, useParams } from "react-router-dom";

function Gids({ children, title, type, ...props }) {
    const { add } = useParams();
    return (
        <>
            {!add ?
                <div className={classes.multidayTours}>
                    <div className={classes.multidayTours_back}>
                        <Link to={`/admin/edit/${title}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>

                    <div className={classes.multidayTours_top}>
                        <div className={classes.multidayTours_top__title}>Гиды региона</div>
                    </div>

                    <div className={classes.gids}>
                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван</div>
                            <div className={classes.gids_info__email}>example@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>

                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван Иванов Иван</div>
                            <div className={classes.gids_info__email}>exampleexample@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>
                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван</div>
                            <div className={classes.gids_info__email}>example@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>

                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван Иванов Иван</div>
                            <div className={classes.gids_info__email}>exampleexample@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>
                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван</div>
                            <div className={classes.gids_info__email}>example@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>

                        <div className={classes.gids_info}>
                            <div className={classes.gids_info__img}>
                                <img src="/feedback_photo.png" alt="" />
                            </div>
                            <div className={classes.gids_info__name}>Иванов Иван Иванов Иван</div>
                            <div className={classes.gids_info__email}>exampleexample@gmail.com</div>
                            <div className={classes.gids_info__activeBTN}>Активный</div>
                            <div className={classes.gids_info__changeBTN}>Изменить</div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                        <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>
                </>
            }
        </>
    );
}

export default Gids;