import React, { useEffect, useState } from "react";
import classes from './ModeredAuthorTours.module.css';

import { useParams, useNavigate, Link } from "react-router-dom";

import server from '../../../../../serverConfig';

function ModeredAuthorTours({ children, ...props }) {
    const { add } = useParams();
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);

        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const [touragents, setTouragents] = useState([]);

    useEffect(() => {
        async function fetchTouragents() {
            try {
                const response = await fetch(`${server}/api/getAuthorTours`);
                const data = await response.json();
                setTouragents(data.authorTour);
            } catch (error) {
                console.error("Error fetching mission info:", error);
            }
        }

        fetchTouragents();
    }, []);

    return (
        <>
            {!add ?
                <div className={classes.multidayTours}>
                    <div className={classes.multidayTours_back}>
                        <button onClick={goBack} className={classes.backButton}>
                            <img src="/back.webp" alt="" /> Вернуться назад
                        </button>
                    </div>

                    <div className={classes.multidayTours_top}>
                        <div className={classes.multidayTours_top__title}>Неподтвержденные туры</div>
                    </div>

                    <div className={classes.gids}>
                        {touragents.length > 0 ?
                            touragents.map((item, index) => (
                                <>
                                    {item.modered == 'false' &&
                                        <div className={classes.gids_info} key={index}>
                                            <div className={classes.gids_info_data}>
                                                <div className={classes.gids_info__elem}>
                                                    {item.tourTitle}
                                                </div>
                                                <div className={classes.gids_info__elem}>{item.author}</div>
                                                <div className={classes.gids_info__elem}>{item.region}</div>
                                            </div>
                                            <Link to={`/toursModered/${item._id}`} target="_blank" className={classes.gids_info__changeBTN}>Посмотреть тур</Link>
                                        </div>
                                    }
                                </>
                            ))
                            :
                            null
                        }
                    </div>
                </div >
                :
                null
            }
        </>
    );
}

export default ModeredAuthorTours;
