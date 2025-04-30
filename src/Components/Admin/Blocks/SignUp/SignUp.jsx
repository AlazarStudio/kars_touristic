import React, { useState } from "react";
import classes from './SignUp.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { Link, useNavigate } from "react-router-dom";

function SignUp({ children, ...props }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
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
        const response = await fetch(`${server}/api/registration`, {
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
                setLoading(false); // Скрытие прелоудера
                navigate('/profile'); // Перенаправление на страницу "profile"
            }, 2000);
        } else {
            setLoading(false); // Скрываем прелоудер при ошибке
            console.error('Ошибка регистрации');
        }
    };

    return (
        <>
            <Header_black />

            <CenterBlock>
                <div className={classes.registerForm}>
                    <H2 text_transform={"uppercase"} text_align={'center'}>Регистрация пользователя</H2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="ФИО"
                            value={formData.name}
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            required
                            onChange={handleChange}
                        />
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
                        <button type="submit" disabled={loading}>Зарегистрироваться</button>
                        <Link to={'/signIn'} style={{'text-align': 'center', 'color': '#4872F2', 'font-weight': '600'}}>Войти</Link>
                    </form>
                    {loading && <div className={classes.loaderWrapper}><div className={classes.loader}></div></div>} {/* Прелоудер */}
                </div>
            </CenterBlock>
        </>
    );
}

export default SignUp;
