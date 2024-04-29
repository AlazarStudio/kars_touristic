import React from "react";
import { Link, useParams } from 'react-router-dom';
import classes from './EditRegion.module.css';

function EditRegion({ children, ...props }) {
    const { id, title } = useParams();
    return (
        <>
            <div className={classes.edit}>
                <div className={classes.editTitle}>Редактировать РЕГИОН: «{title}»</div>
                <div className={classes.editBlocks}>
                    <Link to={`/admin/${id}/${title}/multiday_tours`} className={classes.editBlocks_item}>
                        <div className={classes.editBlocks_item__img}>
                            <img src="/admin_turi.png" alt="" />
                        </div>
                        <div className={classes.editBlocks_item__title}>Многодневные туры</div>
                    </Link>
                    <div className={classes.editBlocks_item}>
                        <div className={classes.editBlocks_item__img}>
                            <img src="/admin_exkursii.png" alt="" />
                        </div>
                        <div className={classes.editBlocks_item__title}>Однодневные экскурсии</div>
                    </div>
                    <div className={classes.editBlocks_item}>
                        <div className={classes.editBlocks_item__img}>
                            <img src="/admin_oteli.png" alt="" />
                        </div>
                        <div className={classes.editBlocks_item__title}>Отели</div>
                    </div>
                    <div className={classes.editBlocks_item}>
                        <div className={classes.editBlocks_item__img}>
                            <img src="/admin_visit.png" alt="" />
                        </div>
                        <div className={classes.editBlocks_item__title}>Что посетить</div>
                    </div>
                    <div className={classes.editBlocks_item}>
                        <div className={classes.editBlocks_item__img}>
                            <img src="/admin_events.png" alt="" />
                        </div>
                        <div className={classes.editBlocks_item__title}>Региональные Mice ивенты</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditRegion;