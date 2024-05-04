import React, { useState, useEffect } from "react";
import classes from './OnedayTours.module.css';

import { Link, useParams } from "react-router-dom";
import AddOnedayTours from "../AddOnedayTours/AddOnedayTours";
import EditOnedayTours from "../EditOnedayTours/EditOnedayTours";

function OnedayTours({ children, title, type, ...props }) {
    const { add } = useParams();

    const [selectedTour, setSelectedTour] = useState(null);
    const [tours, setTours] = useState({});

    let imgUrl = 'http://localhost:5002/refs/';

    const response = () => {
        fetch(`http://localhost:5002/api/getOnedayTours?region=${title}&filter='-'`)
            .then(response => response.json())
            .then(data => setTours(data))
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => { response() }, [title]);

    let data = [];
    let count;

    if (tours && tours.onedayTour) {
        data = tours.onedayTour;
        count = tours.totalCount;
    }

    function deleteElement(id) {
        fetch(`http://localhost:5002/api/deleteOnedayTour/${id}`, {
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
                        <div className={classes.multidayTours_top__title}>Однодневные туры региона</div>
                        <Link to={'addOneday_tour'} className={classes.multidayTours_top__add}>Добавить однодневный тур</Link>
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
                                    <Link to={`editOneday_tour/${tour._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                : <>
                    {add == 'addOneday_tour' ?
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <AddOnedayTours region={title} onTourAdded={response} />
                        </>
                        :
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <EditOnedayTours region={title} onTourAdded={response} />
                        </>
                    }
                </>
            }
        </>
    );
}

export default OnedayTours;