import React, { useState } from "react";
import classes from './SignIn.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { useNavigate } from "react-router-dom";

function SignIn({ children, ...props }) {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Показываем прелоудер
        const response = await fetch(`${server}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);

            setTimeout(() => {
                setLoading(false);
                navigate('/profile');
            }, 2000);
        } else {
            setLoading(false); // Скрываем прелоудер при ошибке
            console.error('Ошибка авторизации');
        }
    };

    return (
        <>
            <Header_black />

            <CenterBlock>
                <div className={classes.registerForm}>
                    <H2 text_transform={"uppercase"} text_align={'center'}>Авторизация</H2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Логин"
                            value={formData.username}
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            required
                            onChange={handleChange}
                        />
                        <button type="submit" disabled={loading}>Войти</button>
                    </form>
                    {loading && <div className={classes.loaderWrapper}><div className={classes.loader}></div></div>} {/* Прелоудер */}
                </div>
            </CenterBlock>
        </>
    );
}

export default SignIn;
