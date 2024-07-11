import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import classes from './EditRegion.module.css';
import EditingPlace from "../EditingPlace/EditingPlace";
import serverConfig from "../../../../../serverConfig";

function EditRegion({ children, role, ...props }) {
    const { id, title, type } = useParams();

    const [regions, setRegions] = useState([]);

    const fetchRegions = () => {
        fetch(`${serverConfig}/api/getRegions`)
            .then(response => response.json())
            .then(data => setRegions(data.regions))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    let region = regions ? regions.filter(region => region.link == title) : '';

    return (
        <>
            {!type ?
                <div className={classes.edit}>
                    <div className={classes.editTitle}>
                        Редактировать РЕГИОН: «{region[0] ? region[0].title : ''}»
                        {role === 'admin' ? <Link to={`/admin/${id}/${title}/editRegionData`}><img src="/edit.webp" alt="" /></Link> : null}
                    </div>

                    <div className={classes.editBlocks}>
                        <Link to={`/admin/${id}/${title}/multiday_tours`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_turi.webp" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Многодневные туры</div>
                        </Link>
                        <Link to={`/admin/${id}/${title}/oneday_tours`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_exkursii.webp" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Однодневные экскурсии</div>
                        </Link>
                        {/* <Link to={`/admin/${id}/${title}/gids`} className={classes.editBlocks_item}>
                            <div className={classes.editBlocks_item__img}>
                                <img src="/admin_gidi.webp" alt="" />
                            </div>
                            <div className={classes.editBlocks_item__title}>Гиды</div>
                        </Link> */}
                        {role === 'admin' ?
                            <>
                                <Link to={`/admin/${id}/${title}/hotels`} className={classes.editBlocks_item}>
                                    <div className={classes.editBlocks_item__img}>
                                        <img src="/admin_oteli.webp" alt="" />
                                    </div>
                                    <div className={classes.editBlocks_item__title}>Отели</div>
                                </Link>
                                <Link to={`/admin/${id}/${title}/visit`} className={classes.editBlocks_item}>
                                    <div className={classes.editBlocks_item__img}>
                                        <img src="/admin_visit.webp" alt="" />
                                    </div>
                                    <div className={classes.editBlocks_item__title}>Что посетить</div>
                                </Link>
                                <Link to={`/admin/${id}/${title}/events`} className={classes.editBlocks_item}>
                                    <div className={classes.editBlocks_item__img}>
                                        <img src="/admin_events.webp" alt="" />
                                    </div>
                                    <div className={classes.editBlocks_item__title}>Региональные Mice ивенты</div>
                                </Link>
                            </>
                            : null
                        }
                    </div>
                </div> :
                <EditingPlace type={type} title={title} role={role}/>
            }
        </>
    );
}

export default EditRegion;