import React, { useState, useEffect } from "react";
import classes from './Profile.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { Link, useNavigate } from "react-router-dom";

function Profile({ children, ...props }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const checkTokenValidity = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Время истечения в миллисекундах
        return Date.now() < expirationTime;
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
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem('token');
                navigate('/signIn');
            }
        } catch (error) {
            console.error('Ошибка получения информации о пользователе', error);
            localStorage.removeItem('token');
            navigate('/signIn');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && checkTokenValidity(token)) {
            getUserInfo(token);
        } else {
            localStorage.removeItem('token');
            navigate('/signIn');
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/signIn');
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <Header_black />
            {user ? (
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.blockUser}>
                            <div className={classes.logout}>
                                {user.role === 'admin' ? (
                                    <Link to={'/admin'}>
                                        <img src="/admin-panel 1.webp" alt="Перейти в Панель Администратора" />
                                        Перейти в Панель Администратора
                                    </Link>
                                ) : user.role === 'touragent' && user.adminPanelAccess ? (
                                    <Link to={'/admin'}>
                                        <img src="/admin-panel 1.webp" alt="Перейти в Панель Автора туров" />
                                        Перейти в Панель Автора туров
                                    </Link>
                                ) : user.role === 'user' ? null : 'Ожидается подтверждение аккаунта администратором'}
                                <img src="/logout.png" alt="Выйти" onClick={logout} />
                            </div>

                            <div className={classes.blockUser_img}>
                                <img src="/noPhoto.png" alt="Фото профиля" />
                            </div>
                            <div className={classes.blockUser_info}>
                                {user.name}
                            </div>
                        </div>

                        <div className={classes.blockUser}>
                            <div className={classes.contacts}>
                                <H2 text_transform={'uppercase'}>Контакты</H2>

                                <div className={classes.contacts_elem}>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/phone.png" alt="Телефон" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.phone}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Телефон</div>
                                        </div>
                                    </div>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/email.png" alt="Почта" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.email}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Почта</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WidthBlock>
                </CenterBlock>
            ) : null}
        </>
    );
}

export default Profile;
