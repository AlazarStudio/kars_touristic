import React, { useEffect, useState } from "react";
import classes from './AddAgent.module.css';
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

function AddAgent({ setActiveTab }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        role: "agent",
        adminPanelAccess: true
    });
    const [loading, setLoading] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const [agents, setAgents] = useState([]);

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
                    role: "agent",
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

    const fetchAgents = async () => {
        const response = await fetch(`${server}/api/getUsers`);
        if (response.ok) {
            const data = await response.json();
            const filteredAgents = data.users.filter(user => user.role === 'agent');
            setAgents(filteredAgents);
        } else {
            console.error('Failed to fetch agents');
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);



    return (
        <div className={classes.multidayTours}>
            <div className={classes.multidayTours_top}>
                <div className={classes.multidayTours_top__title}>Представители</div>
                <button onClick={() => setIsModalActive(true)} className={classes.multidayTours_top__add}>Зарегистрировать представителя</button>
            </div>

            <div className={classes.gids}>
                <div className={classes.gids_info}>
                    <div className={classes.gids_info_data}>
                        <div className={classes.gids_info__elem}><b>ФИО</b></div>
                        <div className={classes.gids_info__elem}><b>Почта</b></div>
                        <div className={classes.gids_info__elem}><b>Телефон</b></div>
                        <div className={classes.gids_info__elem}><b>Логин / Пароль</b></div>
                        <div className={classes.gids_info__elem}><b>Задолженность</b></div>
                    </div>
                </div>
                {agents.length > 0 ?
                    agents.map((item, index) => (
                        <div className={classes.gids_info} key={index} onClick={() => setActiveTab('brons')}>
                            <Link
                                to="/admin/brons"
                                state={{
                                    name: item.name,
                                    paymentType: 'cash',
                                    paymentState: 'false'
                                }}
                                className={classes.gids_info_data}
                            >
                                <div className={classes.gids_info__elem}>{item.name}</div>
                                <div className={classes.gids_info__elem}>{item.email}</div>
                                <div className={classes.gids_info__elem}>{item.phone}</div>
                                <div className={classes.gids_info__elem}>{item.username}</div>
                                <div className={classes.gids_info__elem}>{item.debt.toLocaleString('ru-RU')} ₽</div>
                            </Link>
                        </div>
                    ))
                    :
                    null
                }
            </div>

            <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
                <div className={classes.addData}>
                    <div className={classes.addData_title}>Регистрация представителя</div>
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

export default AddAgent;