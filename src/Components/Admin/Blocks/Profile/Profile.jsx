import React, { useState, useEffect } from "react";
import classes from './Profile.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { Link, useNavigate } from "react-router-dom";

function Profile({ children, ...props }) {
    const [user, setUser] = useState();

    let token = localStorage.getItem('token');

    const navigate = useNavigate();

    const getUserInfo = async (token) => {
        const response = await fetch(`${server}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData)
        } else {
            localStorage.removeItem('token');
            console.error('Ошибка получения информации о пользователе');
        }
    };


    useEffect(() => {
        if (token) {
            getUserInfo(token);
        } else {
            navigate('/signIn');
        }
    }, [token])

    function logout() {
        localStorage.clear();
        setUser(null);
    }

    return (
        <>
            <Header_black />

            {user ?
                <CenterBlock>
                    <WidthBlock>
                        <div className={classes.blockUser}>
                            <div className={classes.logout}>
                                {user && user.role && user.role == 'admin' ?
                                    <Link to={'/admin'}>
                                        <img src="/admin-panel 1.webp" alt="" />
                                        Перейти в Панель Администратора
                                    </Link>
                                    : user && user.role && user.adminPanelAccess && user.role == 'touragent' ?
                                        <Link to={'/admin'}>
                                            <img src="/admin-panel 1.webp" alt="" />
                                            Перейти в Панель Турагента
                                        </Link>
                                        : 'Ожидается подтверждение аккаунта администратором'}
                                <img src="/logout.png" alt="" onClick={logout} />
                            </div>

                            <div className={classes.blockUser_img}>
                                <img src="/noPhoto.png" alt="" />
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
                                            <img src="/phone.png" alt="" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.phone}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Телефон</div>
                                        </div>
                                    </div>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/email.png" alt="" />
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
                : null
            }
        </>
    );
}

export default Profile;
