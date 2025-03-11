import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import classes from './EditRegion.module.css';
import EditingPlace from "../EditingPlace/EditingPlace";
import serverConfig from "../../../../../serverConfig";
import AuthorTours from "../AuthorTours/AuthorTours";

function EditRegion({ children, role, userName, userID, ...props }) {
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

    // Ensure regions array is populated before accessing
    let region = regions.length ? regions.filter(region => region.link === title) : [];

    return (
        <>
            {!type ?
                <div className={classes.edit}>
                    {role === 'admin' && region.length > 0 ?
                        <div className={classes.editTitle}>
                            Редактировать РЕГИОН: «{region[0].title}»
                            <Link to={`/admin/${id}/${title}/editRegionData`}><img src="/edit.webp" alt="" /></Link>
                        </div>
                        : null
                    }

                    {role === 'touragent' && region.length > 0 ?
                        <AuthorTours regionName={region[0].title} type={type} title={title} role={role} userName={userName} userID={userID}/>
                        : null
                    }

                    {role === 'admin' ?
                        <div className={classes.editBlocks}>
                            <Link to={`/admin1/${id}/${title}/multiday_tours`} className={classes.editBlocks_item}>
                                <div className={classes.editBlocks_item__img}>
                                    <img src="/admin_turi.webp" alt="" />
                                </div>
                                <div className={classes.editBlocks_item__title}>Многодневные туры</div>
                            </Link>
                            <Link to={`/admin1/${id}/${title}/oneday_tours`} className={classes.editBlocks_item}>
                                <div className={classes.editBlocks_item__img}>
                                    <img src="/admin_exkursii.webp" alt="" />
                                </div>
                                <div className={classes.editBlocks_item__title}>Однодневные экскурсии</div>
                            </Link>
                            <Link to={`/admin/${id}/${title}/hotels`} className={classes.editBlocks_item}>
                                <div className={classes.editBlocks_item__img}>
                                    <img src="/admin_oteli.webp" alt="" />
                                </div>
                                <div className={classes.editBlocks_item__title}>Отели / Апартаменты</div>
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
                            {/* <Link to={`/admin/${id}/${title}/gids`} className={classes.editBlocks_item}>
                                <div className={classes.editBlocks_item__img}>
                                    <img src="/admin_gidi.webp" alt="" />
                                </div>
                                <div className={classes.editBlocks_item__title}>Гиды</div>
                            </Link> */}
                        </div>
                        : null
                    }
                </div> :
                <EditingPlace type={type} title={title} role={role} userName={userName} userID={userID}/>
            }
        </>
    );
}

export default EditRegion;
