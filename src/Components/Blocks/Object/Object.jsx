import React, { useEffect, useState } from "react";
import classes from './Object.module.css';
import { Link, useNavigate } from "react-router-dom";
import server from '../../../serverConfig';

function Object({ pageName, titleObject, regionData, width }) {
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    }

    let pageNameVisit = '';

    if (regionData.days) {
        if (regionData.days.length > 1) {
            pageNameVisit = 'tours';
        }
        if (regionData.days.length <= 1) {
            pageNameVisit = 'excursions';
        }
    }

    function toTop() {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }

    const token = localStorage.getItem('token');

    const updateUser = async (token, updates) => {
        try {
            const response = await fetch(`${server}/api/userUpdate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) {
                throw new Error('Failed to update user.');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error; 
        }
    };

    const getUserInfo = async (token) => {
        try {
            const response = await fetch(`${server}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    };

    const [user, setUser] = useState(null); 

    useEffect(() => {
        getUserInfo(token)
            .then(userData => setUser(userData))
            .catch(error => console.error('Error initializing user:', error));
    }, [token]);

    const navigate = useNavigate();

    const handleLikeClick = async () => {
        if (token) {
            const updates = {
                likes: [regionData._id]
            };

            try {
                const updatedUser = await updateUser(token, updates);
                setUser(updatedUser);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            navigate('/signIn');
        }
    };

    const handleAddCartClick = async () => {
        if (token) {
            const updates = {
                cart: [regionData._id]
            };

            try {
                const updatedUser = await updateUser(token, updates);
                setUser(updatedUser);
                alert(updatedUser.message ? updatedUser.message : updatedUser);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            navigate('/signIn');
        }
    };

    return (
        <div className={classes.objects_item} style={{ width: width }}>
            <div className={classes.objects_item__like} onClick={handleLikeClick}>
                {user && user.likes && user.likes.includes(regionData._id)
                    ? <img src="/userLike_full.png" alt="Liked" />
                    : <img src="/userLike_empty.png" alt="Not Liked" />
                }
            </div>
            <div className={classes.objects_item__img}>
                <img src={`${server}/refs/${regionData.mainPhoto ? regionData.mainPhoto : regionData.photos[0]}`} alt="" />
            </div>
            <div className={classes.objects_item__bottom}>
                {titleObject !== 'title'
                    ? (
                        <>
                            <div className={classes.objects_item__title}>
                                {truncateString(regionData[titleObject], 50)}
                            </div>
                            <div className={classes.objects_item__desc}>
                                <div>Cпособ передвижения: <span>{regionData.travelMethod}</span></div>
                                <div>Продолжительность: <span>{regionData.duration}</span></div>
                                <div>Время отправления: <span>{regionData.departureTime}</span></div>
                                <div>Тип экскурсии: <span>{regionData.tourType}</span></div>
                                <div>Сложность: <span>{regionData.difficulty}</span></div>
                            </div>
                            {regionData.optional &&
                                <div className={classes.objects_item__optional}>
                                    <img src="/optional.png" alt="Optional" /> {regionData.optional}
                                </div>
                            }
                            <div className={classes.objects_item__price}>
                                <div>Стоимость: <span>{regionData.cost} ₽ *</span></div>
                            </div>
                            <div className={classes.buttons}>
                                <Link to={`/${pageName ? pageName : pageNameVisit}/${regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                                <Link to={``} className={`${classes.objects_item__button} ${classes.objects_item__bron}`} onClick={handleAddCartClick}>Добавить в корзину</Link>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className={classes.objects_item__title} style={{ textAlign: 'center' }}>
                                {truncateString(regionData[titleObject], 50)}
                            </div>
                            <Link to={`/${pageName ? pageName : pageNameVisit}/${regionData._id}`} className={classes.objects_item__button} onClick={toTop}>Подробнее</Link>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Object;
