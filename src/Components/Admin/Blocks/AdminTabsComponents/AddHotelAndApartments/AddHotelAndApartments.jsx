import React, { useEffect, useState } from "react";
import classes from './AddHotelAndApartments.module.css';
import server from '../../../../../serverConfig';
import { useNavigate, Link } from "react-router-dom";

function Modal({ isActive, onClose, children }) {
    return (
        <div className={`${classes.modal} ${isActive ? classes.active : ''}`} onClick={onClose}>
            <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={classes.closeButton} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

function AddHotelAndApartments({ setActiveTab }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        role: "user",
        adminPanelAccess: true
    });
    const [loading, setLoading] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [bronHotels, setBronHotels] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch(`${server}/api/registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setTimeout(() => {
                setLoading(false);
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    username: "",
                    password: "",
                    role: "user",
                    adminPanelAccess: true
                });
                setIsModalActive(false);
                fetchAgents();
            }, 1000);
        } else {
            setLoading(false);
            console.error('Registration error');
        }
    };

    const fetchBronHotels = async () => {
        const response = await fetch(`${server}/api/getHotelBrons`);
        if (response.ok) {
            const data = await response.json();
            setBronHotels(data.hotelBron.reverse());
        } else {
            console.error('Failed to fetch BronHotels');
        }
    };

    useEffect(() => {
        fetchBronHotels();
    }, []);

    function formatDate(isoDate) {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }
    
    return (
        <div className={classes.multidayTours}>
            <div className={classes.multidayTours_top}>
                <div className={classes.multidayTours_top__title}>Брони Отелей / Апартаментов</div>
                <button onClick={() => setIsModalActive(true)} className={classes.multidayTours_top__add}>Забронировать отель</button>
            </div>

            <div className={classes.gids}>
                <div className={classes.gids_info}>
                    <div className={classes.gids_info_data}>
                        <div className={classes.gids_info__elem}><b>Дата брони</b></div>
                        <div className={classes.gids_info__elem}><b>Название отеля</b></div>
                        <div className={classes.gids_info__elem}><b>Количество гостей</b></div>
                        <div className={classes.gids_info__elem}><b>Полная цена</b></div>
                        <div className={classes.gids_info__elem}><b>Дата прибытия</b></div>
                        <div className={classes.gids_info__elem}><b>Дата выезда</b></div>
                    </div>
                </div>
                {bronHotels.length > 0 ?
                    bronHotels.map((item, index) => (
                        <div className={classes.gids_info} key={index}>
                            <div className={classes.gids_info__elem}>{formatDate(item.createdAt)}</div>
                            <div className={classes.gids_info__elem}>{item.name}</div>
                            <div className={classes.gids_info__elem}>{item.guests}</div>
                            <div className={classes.gids_info__elem}>{Number(item.fullPrice).toLocaleString('ru-RU')} ₽</div>
                            <div className={classes.gids_info__elem}>{formatDate(item.arrivalDate)}</div>
                            <div className={classes.gids_info__elem}>{formatDate(item.departureDate)}</div>
                        </div>
                    ))
                    :
                    null
                }
            </div>

            <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
                <div className={classes.addData}>
                    <div className={classes.addData_title}>Регистрация пользователя</div>
                    <form onSubmit={handleSubmit} className={classes.registerForm}>
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
                        <button type="submit" disabled={loading}>Зарегистрировать</button>
                    </form>
                    {loading && <div className={classes.loaderWrapper}><div className={classes.loader}></div></div>}
                </div>
            </Modal>
        </div>
    );
}

export default AddHotelAndApartments;