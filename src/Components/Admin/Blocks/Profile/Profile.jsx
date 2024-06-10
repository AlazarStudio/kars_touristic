import React, { useState, useEffect } from "react";
import classes from './Profile.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { Link } from "react-router-dom";

function Profile({ children, ...props }) {
    const [user, setUser] = useState();

    let token = localStorage.getItem('token');

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
            console.error('Ошибка получения информации о пользователе');
        }
    };


    useEffect(() => {
        if (token) {
            getUserInfo(token);
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
                    <H2 text_transform={"uppercase"} text_align={'center'}>Информация о пользователе</H2>

                    {user.name}

                    <button onClick={logout}>Выход</button>
                </CenterBlock>
                :
                <CenterBlock>
                    <div>
                        <Link to={'/signUp'}>Регистрация</Link> /
                        <Link to={'/signIn'}>Авторизация</Link>
                    </div>
                </CenterBlock>
            }
        </>
    );
}

export default Profile;
