import React, { useEffect, useState } from "react";
import classes from './Gids.module.css';

import { useParams, useNavigate } from "react-router-dom";

import server from '../../../../../serverConfig';
function Gids({ children, ...props }) {
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
                const response = await fetch(`${server}/api/getTouragents`);
                const data = await response.json();
                setTouragents(data.users);
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
                        <div className={classes.multidayTours_top__title}>Турагенты</div>
                    </div>

                    <div className={classes.gids}>
                        {touragents.length > 0 ?
                            touragents.map((item, index) => (
                                <div className={classes.gids_info} key={index}>
                                    <div className={classes.gids_info_data}>
                                        <div className={classes.gids_info__elem}>
                                            {item.name}
                                            {item.adminPanelAccess ?
                                                <span className={classes.gids_info__access}>(Подтвержден)</span>
                                                :
                                                <span className={classes.gids_info__noAccess}>(Не подтвержден)</span>
                                            }
                                        </div>
                                        <div className={classes.gids_info__elem}>{item.email}</div>
                                        <div className={classes.gids_info__elem}>{item.phone}</div>
                                    </div>
                                    <div className={classes.gids_info__changeBTN}>Посмотреть профиль</div>
                                </div>
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

export default Gids;
