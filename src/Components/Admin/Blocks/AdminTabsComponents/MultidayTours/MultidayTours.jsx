import React, { useState, useEffect } from "react";
import classes from './MultidayTours.module.css';

import server from '../../../../../serverConfig';

import { Link, useParams } from "react-router-dom";
import AddMultidayTours from "../AddMultidayTours/AddMultidayTours";
import EditMultidayTours from "../EditMultidayTours/EditMultidayTours";

function MultidayTours({ children, title, type, ...props }) {
    const { add } = useParams();

    console.log(server);

    const [selectedTour, setSelectedTour] = useState(null);
    const [tours, setTours] = useState({});

    let imgUrl = `${server}/refs/`;

    const response = () => {
        fetch(`${server}/api/getMultidayTours?region=${title}&filter='-'`)
            .then(response => response.json())
            .then(data => setTours(data))
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => { response() }, [title]);

    let data = [];
    let count;

    if (tours && tours.multidayTour) {
        data = tours.multidayTour;
        count = tours.totalCount;
    }

    function deleteElement(id) {
        fetch(`${server}/api/deleteMultidayTour/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                response();
            })
            .catch(error => console.error('Ошибка при удалении тура:', error));
    }
    return (
        <>
            {!add ?
                <div className={classes.multidayTours}>
                    <div className={classes.multidayTours_back}>
                        <Link to={`/admin/edit/${title}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>

                    <div className={classes.multidayTours_top}>
                        <div className={classes.multidayTours_top__title}>Многодневные туры региона</div>
                        <Link to={'addMultiday_tour'} className={classes.multidayTours_top__add}>Добавить многодневный тур</Link>
                    </div>

                    <div className={classes.multidayTours_data}>
                        {data.map((tour, index) => (
                            <div className={classes.multidayTours_data__tour} key={index}>
                                <div className={classes.multidayTours_data__tour___img}>
                                    <img src={imgUrl + tour.photos[0]} alt="" />
                                </div>
                                <div className={classes.multidayTours_data__tour___info}>
                                    <div className={classes.multidayTours_data__tour___info____title}>{tour.tourTitle}</div>
                                </div>
                                <div className={classes.multidayTours_data__tour___btns}>
                                    <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`} onClick={() => deleteElement(tour._id)}>Удалить</div>
                                    <Link to={`editMultiday_tour/${tour._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                : <>
                    {add == 'addMultiday_tour' ?
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <AddMultidayTours region={title} onTourAdded={response} />
                        </>
                        :
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <EditMultidayTours region={title} onTourAdded={response} />
                        </>
                    }
                </>
            }
        </>
    );
}

export default MultidayTours;