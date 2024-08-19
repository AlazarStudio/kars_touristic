import React, { useEffect, useState } from "react";
import classes from './Brons.module.css';
import { useParams, useNavigate, Link } from "react-router-dom";
import server from '../../../../../serverConfig';

function Brons({ children, ...props }) {
    const { add } = useParams();
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);

        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const [touragents, setTouragents] = useState([]);
    const [filteredAgents, setFilteredAgents] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentType, setPaymentType] = useState('');

    useEffect(() => {
        async function fetchTouragents() {
            try {
                const response = await fetch(`${server}/api/getAgents`);
                const data = await response.json();
                setTouragents(data.agent);
                setFilteredAgents(data.agent); // Инициализация отфильтрованного списка
            } catch (error) {
                console.error("Error fetching mission info:", error);
            }
        }

        fetchTouragents();
    }, []);

    const getUserInfo = async () => {
        const response = await fetch(`${server}/api/getUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUsers(userData.users);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserNameById = (userId) => {
        const user = users.find(user => user._id === userId);
        return user ? user.name : 'Неизвестный пользователь';
    };

    // Функция для фильтрации данных
    const applyFilters = () => {
        let filtered = touragents.filter(agent => {
            const tourTitles = agent.tours.map((tour) => tour.tourTitle.toLowerCase()).join(', ');
            const passangerTitles = agent.passengers.map((passenger) => passenger.fullName.toLowerCase()).join(', ');
            const agentName = getUserNameById(agent.agent).toLowerCase();
            const price = Number(agent.price);

            const textMatch = searchQuery.toLowerCase();
            const matchesTourTitleOrAgent =
                tourTitles.includes(textMatch) ||
                agentName.includes(textMatch) ||
                passangerTitles.includes(textMatch) ||
                String(price).includes(textMatch);

            return (
                matchesTourTitleOrAgent &&
                (!paymentType || agent.paymentType === paymentType)
            );
        });

        setFilteredAgents(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [searchQuery, paymentType]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePaymentTypeChange = (e) => {
        setPaymentType(e.target.value);
    };

    async function updateConfirm(id, price, agentID) {
        const user = users.find(user => user._id === agentID);

        let debtUser = user.debt - price;

        try {
            // Обновление статуса подтверждения на сервере
            const confirmResponse = await fetch(`${server}/api/updateOneAgent/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    confirm: true,
                })
            });

            if (confirmResponse.ok) {
                // Обновление долга пользователя на сервере
                const debtResponse = await fetch(`${server}/api/userUpdateDebt`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        debt: debtUser,
                        idUser: agentID
                    })
                });

                if (debtResponse.ok) {
                    // Обновление состояния filteredAgents после успешного ответа сервера
                    setFilteredAgents(prevAgents =>
                        prevAgents.map(agent =>
                            agent._id === id ? { ...agent, confirm: true } : agent
                        )
                    );
                } else {
                    console.error('Error updating user debt');
                }
            } else {
                console.error('Error updating agent confirmation');
            }
        } catch (error) {
            console.error('Error updating confirmation and debt:', error);
        }
    }


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
                        <div className={classes.multidayTours_top__title}>Брони</div>
                    </div>

                    <div className={classes.filters}>
                        <input
                            type="text"
                            placeholder="Поиск по названию тура, представителю или пассажиру"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={classes.filterInput}
                        />
                        <select
                            name="paymentType"
                            value={paymentType}
                            onChange={handlePaymentTypeChange}
                            className={classes.filterSelect}
                        >
                            <option value="">Все способы оплаты</option>
                            <option value="cash">Наличные</option>
                            <option value="card">Карта</option>
                        </select>
                    </div>

                    <div className={classes.gids}>
                        <ul className={classes.listBron}>
                            <li>
                                <div className={classes.listBronItem}><b>Название тура</b></div>
                                <div className={classes.listBronItem}><b>Пассажиры</b></div>
                                <div className={classes.listBronItem}><b>Представитель</b></div>
                                <div className={classes.listBronItem}><b>Полная цена</b></div>
                                <div className={classes.listBronItem}><b>Способ оплаты</b></div>
                                <div className={classes.listBronItem}><b>Подтвердить получение</b></div>
                            </li>
                            {filteredAgents.length > 0 ?
                                filteredAgents.reverse().map((agent, index) => (
                                    <li key={index}>
                                        <div className={classes.listBronItem}>{agent.tours.map((tour) => tour.tourTitle).join(', ')}</div>
                                        <div className={classes.listBronItem}>{agent.passengers.map((tour) => tour.fullName).join(', ')}</div>
                                        <div className={classes.listBronItem}>{getUserNameById(agent.agent)}</div>
                                        <div className={classes.listBronItem}>{Number(agent.price).toLocaleString('ru-RU')} ₽ </div>
                                        <div className={classes.listBronItem}>{agent.paymentType === 'cash' ? 'Наличные' : 'Карта'}</div>
                                        <div className={classes.listBronItem}>{
                                            (agent.paymentType === 'cash' && agent.confirm == false) ?
                                                <button onClick={() => updateConfirm(agent._id, agent.price, agent.agent)}> Подтвердить получение</button> :
                                                'Подтверждено'
                                        }
                                        </div>
                                    </li>
                                ))
                                :
                                <li>Нет данных, соответствующих фильтру</li>
                            }
                        </ul>
                    </div>
                </div >
                :
                null
            }
        </>
    );
}

export default Brons;
