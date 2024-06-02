import React from "react";
import { Link, useParams } from 'react-router-dom';
import classes from './EditRegion.module.css';
import EditingPlace from "../EditingPlace/EditingPlace";

function EditRegion({ children, ...props }) {
    const { id, title, type } = useParams();
    return (
        <>
            {!type ?
                <div className={classes.edit}>
                    <div className={classes.editTitle}>
                        Редактировать РЕГИОН: «{title}»
                        {/* <Link to={`/admin/${id}/${title}/editRegionData`}><img src="/edit.png" alt="" /></Link> */}
                    </div>
                    <div className={classes.editBlocks}>
                        <Link to={`/admin/${id}/${title}/multiday_tours`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_turi.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Многодневные туры</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/oneday_tours`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_exkursii.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Однодневные экскурсии</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/gids`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_gidi.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Гиды</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/hotels`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_oteli.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Отели</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/visit`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_visit.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Что посетить</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/events`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_events.png" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Региональные Mice ивенты</div>
                        </Link>
                    </div>
                </div> :
                <EditingPlace type={type} title={title} />
            }
        </>
    );
}

export default EditRegion;