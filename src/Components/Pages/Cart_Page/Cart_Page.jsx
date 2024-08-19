import React, { useEffect, useState } from "react";
import classes from './Cart_Page.module.css';
import Header_black from "../../Blocks/Header_black/Header_black";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import server from '../../../serverConfig';

function Cart_Page({ children, ...props }) {
    const [user, setUser] = useState(null);
    const [multidayTours, setMultidayTours] = useState([]);
    const [onedayTours, setOnedayTours] = useState([]);
    const [selectedTours, setSelectedTours] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const [passengerInfo, setPassengerInfo] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isAgreed, setIsAgreed] = useState(false);

    const token = localStorage.getItem('token');

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

    useEffect(() => {
        getUserInfo(token)
            .then(userData => setUser(userData))
            .catch(error => console.error('Error initializing user:', error));
    }, [token]);

    function fetchRequest(endPoint, type, setFunction) {
        fetch(`${server}/api/${endPoint}`)
            .then(response => response.json())
            .then(data => setFunction(data[type]))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    }

    useEffect(() => {
        fetchRequest('getMultidayTours', 'multidayTour', setMultidayTours);
        fetchRequest('getOnedayTours', 'onedayTour', setOnedayTours);
    }, []);

    const handleDeleteItem = async (tourId) => {
        try {
            const response = await fetch(`${server}/api/userCart/${tourId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                alert('Тур удален из корзины');
            } else {
                throw new Error('Failed to delete item from cart.');
            }
        } catch (error) {
            console.error('Error deleting item from cart:', error);
        }
    };

    const handleSelectTour = (tour) => {
        setSelectedTours(prevSelectedTours => {
            if (prevSelectedTours.includes(tour)) {
                return prevSelectedTours.filter(item => item._id !== tour._id);
            } else {
                return [...prevSelectedTours, tour];
            }
        });
    };

    const handlePlaceOrder = () => {
        if (user.role === "agent") {
            setIsModalOpen(true);
        } else {
            // обычный процесс оформления заказа
        }
    };

    const handlePassengerCountChange = (e) => {
        const count = parseInt(e.target.value);
        setPassengerCount(count);

        const newPassengerInfo = Array.from({ length: count }, (_, i) => ({
            fullName: "",
            email: "",
            phone: "",
        }));
        setPassengerInfo(newPassengerInfo);
    };

    const handlePassengerInfoChange = (index, field, value) => {
        const updatedPassengerInfo = [...passengerInfo];
        updatedPassengerInfo[index][field] = value;
        setPassengerInfo(updatedPassengerInfo);
    };

    const handleBooking = () => {
        const totalSum = totalCost * passengerCount;
        console.log("Total sum:", totalSum);
        console.log("Passenger info:", passengerInfo);
        console.log("Payment method:", paymentMethod);

        // Далее можно отправить данные на сервер для завершения бронирования
    };

    let cartMass = user ? user.cart : [];

    const filteredMultidayTours = multidayTours.length > 0 ? multidayTours.filter(tour => cartMass.includes(tour._id)) : [];
    const filteredOnedayTours = onedayTours.length > 0 ? onedayTours.filter(tour => cartMass.includes(tour._id)) : [];

    let data = filteredMultidayTours.concat(filteredOnedayTours);

    const totalCost = selectedTours.reduce((acc, tour) => acc + parseFloat(tour.cost.replace(/\s/g, '')), 0);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isModalOpen]);
    
    return (
        <>
            <Header_black />

            <CenterBlock>
                <WidthBlock>
                    <div className={classes.cart}>
                        <div className={classes.cartPage}>
                            <div className={classes.cartPage_left}>
                                <div className={classes.cartPage_left__title}>Корзина</div>
                                <div className={classes.cartPage_left__data}>
                                    {data && data.length > 0 ?
                                        data.map((item, index) => (
                                            <div className={classes.cartPage_left__data___elem} key={index}>
                                                <input
                                                    type="checkbox"
                                                    className={classes.cartPage_left__data___elem____objectChoose}
                                                    onChange={() => handleSelectTour(item)}
                                                />
                                                <div className={classes.cartPage_left__data___elem____objectData}>
                                                    <div className={classes.objectData_img}>
                                                        <img src={`${server}/refs/${item.mainPhoto}`} alt="" />
                                                    </div>
                                                    <div className={classes.objectData_info}>
                                                        <div className={classes.objectData_info__title}>{item.tourTitle}</div>
                                                        <div className={classes.objectData_info__list}>
                                                            <p>Способ передвижения: <span>{item.travelMethod}</span></p>
                                                            <p>Продолжительность: <span>{item.duration}</span></p>
                                                            <p>Время отправления: <span>{item.departureTime}</span></p>
                                                            <p>Тип экскурсии: <span>{item.tourType}</span></p>
                                                            <p>Сложность: <span>{item.difficulty}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className={classes.objectData_price}>
                                                        <div className={classes.objectData_price__num}>{formatNumber(item.cost)} ₽</div>
                                                        <div className={classes.objectData_price__delete} onClick={() => handleDeleteItem(item._id)}>Удалить</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : 'В корзине нет товаров'
                                    }
                                </div>
                            </div>
                            <div className={classes.cartPage_right}>
                                <div className={classes.cartPage_right__info}>
                                    <div className={classes.cartPage_right__info___title}>Итого</div>
                                    <div className={classes.cartPage_right__info___num}>{formatNumber(totalCost)} ₽</div>
                                </div>
                                <div className={classes.cartPage_right__infoBlock}>
                                    <div className={classes.cartPage_right__info___lower}>
                                        <div className={classes.cartPage_right__info___lower___title}>Выбрано товаров</div>
                                        <div className={classes.cartPage_right__info___lower___num}>{selectedTours.length}</div>
                                    </div>
                                    <div className={classes.cartPage_right__info___lower}>
                                        <div className={classes.cartPage_right__info___lower___title}>Всего товаров в корзине</div>
                                        <div className={classes.cartPage_right__info___lower___num}>{data.length}</div>
                                    </div>
                                </div>
                                <div className={classes.cartPage_right__button}
                                    onClick={selectedTours.length > 0 ? handlePlaceOrder : null}
                                    style={{
                                        backgroundColor: selectedTours.length > 0 ? '#007bff' : '#ccc',
                                        cursor: selectedTours.length > 0 ? 'pointer' : 'not-allowed'
                                    }}>
                                    Оформить заказ
                                </div>
                                {selectedTours.length === 0 && (
                                    <div className={classes.errorMessage}>
                                        Пожалуйста, выберите тур перед оформлением заказа.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>

            {isModalOpen && (
                <div className={classes.modal}>
                    <div className={classes.modalContent}>
                        <div className={classes.closeButton} onClick={() => {
                            setIsModalOpen(false);
                            setPassengerInfo([]);
                            setPassengerCount(1)
                        }}>
                            &times;
                        </div>
                        <h2>Введите количество людей</h2>

                        <input
                            type="number"
                            min="1"
                            value={passengerCount}
                            onChange={handlePassengerCountChange}
                            className={classes.passangerCount}
                        />

                        <div className={classes.passengerBlock}>
                            {Array.from({ length: passengerCount }, (_, i) => (
                                <div key={i} className={classes.passengerInfo}>
                                    <h3>Пассажир {i + 1}</h3>
                                    <input
                                        type="text"
                                        placeholder="ФИО"
                                        value={passengerInfo[i]?.fullName || ""}
                                        onChange={(e) => handlePassengerInfoChange(i, "fullName", e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Почта"
                                        value={passengerInfo[i]?.email || ""}
                                        onChange={(e) => handlePassengerInfoChange(i, "email", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Номер телефона"
                                        value={passengerInfo[i]?.phone || ""}
                                        onChange={(e) => handlePassengerInfoChange(i, "phone", e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={classes.totalSum}>
                            Итоговая сумма: {formatNumber(totalCost * passengerCount)} ₽
                        </div>

                        <div className={classes.paymentMethod}>
                            <h3>Выберите способ оплаты</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Карта
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                Наличные
                            </label>
                        </div>

                        <br />
                        <br />
                        <br />

                        <div className={classes.cartPage_right__oferta}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                />
                                <p>Согласен с условиями Правил пользования торговой площадкой и правилами возврата</p>
                            </label>
                            <button
                                onClick={isAgreed ? handleBooking : null}
                                disabled={!isAgreed}
                                style={{
                                    backgroundColor: isAgreed ? '#007bff' : '#ccc',
                                    cursor: isAgreed ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Забронировать тур
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default Cart_Page;
