import React, { useEffect, useState } from "react";
import classes from './Cart_Page.module.css';
import Header_black from "../../Blocks/Header_black/Header_black";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import server from '../../../serverConfig';
import { v4 as uuidv4 } from 'uuid';
import PaymentButton from '../../PaymentButton/PaymentButton'

function Cart_Page({ children, ...props }) {
    const [user, setUser] = useState(null);
    const [cartLength, setCartLength] = useState(0);
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
            .then(userData => {
                setUser(userData)
                setCartLength(userData.cart.length)
            })
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
                setCartLength(user && user.cart.length - 1)
                setSelectedTours(prevSelectedTours =>
                    prevSelectedTours.filter(tour => tour._id !== tourId)
                );
                // alert('Тур удален из корзины');
            } else {
                const errorText = await response.text();
                console.error(`Failed to delete tour. Server response: ${errorText}`);
                throw new Error('Failed to delete item from cart.');
            }
        } catch (error) {
            console.error('Error deleting item from cart:', error);
        }
    };

    const handleSelectTour = (tour) => {
        setSelectedTours(prevSelectedTours => {
            return [tour];
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

        setPassengerInfo(prevPassengerInfo => {
            const newPassengerInfo = [...prevPassengerInfo];

            // Если увеличиваем количество пассажиров, добавляем новые объекты
            if (count > prevPassengerInfo.length) {
                for (let i = prevPassengerInfo.length; i < count; i++) {
                    newPassengerInfo.push({
                        fullName: "",
                        email: "",
                        phone: "",
                    });
                }
            }
            // Если уменьшаем количество пассажиров, удаляем лишние объекты
            else if (count < prevPassengerInfo.length) {
                newPassengerInfo.splice(count);
            }

            return newPassengerInfo;
        });

        setPassengerCount(count);
    };

    const handlePassengerInfoChange = (index, field, value) => {
        setPassengerInfo(prevPassengerInfo => {
            const updatedPassengerInfo = [...prevPassengerInfo];

            // Убедитесь, что объект на нужном индексе существует
            if (!updatedPassengerInfo[index]) {
                updatedPassengerInfo[index] = { fullName: "", email: "", phone: "" };
            }

            updatedPassengerInfo[index][field] = value;
            return updatedPassengerInfo;
        });
    };

    async function updateState(state) {
        const agentId = user._id;
        await fetch(`${server}/api/updateOneAgent/${agentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymanetState: state,
            })
        });
    }

    const handleBooking = async () => {
        const totalSum = totalCost * passengerCount;
        let debtUser = user.debt + totalSum;

        let confirmData = paymentMethod === 'cash' ? false : true;

        let formData = {
            price: totalSum,
            agent: user._id,
            paymentType: paymentMethod,
            tours: selectedTours,
            passengers: passengerInfo,
            paymanetState: paymentMethod === 'cash' ? 'done' : 'processing',
            confirm: confirmData
        }

        try {
            const response = await fetch(`${server}/api/addAgent`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Удаление туров после успешного бронирования
                await Promise.all(selectedTours.map(async (tour) => {
                    await handleDeleteItem(tour._id);
                }));

                if (paymentMethod === 'cash') {
                    await fetch(`${server}/api/userUpdate`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ debt: debtUser })
                    });
                }

                setIsModalOpen(false);
                setPassengerCount(0);
                setSelectedTours([]);
                // location.reload();
                alert('Заказ успешно оформлен')
            } else {
                throw new Error('Failed to complete booking.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
        }
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

    const handlePaymentSuccess = async () => {
        await handleBooking();  // Обработка бронирования
        await updateState('done');  // Обновление состояния
    };

    const handleUserPayment = async () => {
        await Promise.all(selectedTours.map(async (tour) => {
            await handleDeleteItem(tour._id);
        }));
    }

    const selectedTourTitles = selectedTours.map(tour => tour.tourTitle).join(', ').substring(0, 128).trim();

    const uniqueOrderId = uuidv4();

    return (
        <>
            <Header_black cartCount={cartLength} />

            <CenterBlock>
                <WidthBlock>
                    <div className={classes.cart}>
                        <div className={classes.cartPage}>
                            <div className={classes.cartPage_left}>
                                <div className={classes.cartPage_left__title}>Корзина</div>
                                <div className={classes.cartPage_left__data}>
                                    {data && data.length > 0 ?
                                        data.map((item) => (
                                            <div className={classes.cartPage_left__data___elem} key={item._id}>
                                                <input
                                                    type="checkbox"
                                                    className={classes.cartPage_left__data___elem____objectChoose}
                                                    onChange={() => handleSelectTour(item)}
                                                    checked={selectedTours.some(tour => tour._id === item._id)}  // проверка, выбран ли тур
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
                                    {/* <div className={classes.cartPage_right__info___lower}>
                                        <div className={classes.cartPage_right__info___lower___title}>Выбрано товаров</div>
                                        <div className={classes.cartPage_right__info___lower___num}>{selectedTours.length}</div>
                                    </div> */}
                                    <div className={classes.cartPage_right__info___lower}>
                                        <div className={classes.cartPage_right__info___lower___title}>Всего товаров в корзине</div>
                                        <div className={classes.cartPage_right__info___lower___num}>{data.length}</div>
                                    </div>
                                </div>

                                {(user && user.role) === 'user' ?
                                    selectedTours.length === 0 ? null :
                                        <PaymentButton
                                            style={{}}
                                            order_name={selectedTourTitles}
                                            order_cost={totalCost}
                                            order_id={uniqueOrderId}
                                            onPaymentSuccess={handleUserPayment}
                                        ></PaymentButton>
                                    :
                                    ((user && user.role) === 'agent' || (user && user.role === 'admin')) &&
                                    <div className={classes.cartPage_right__button}
                                        onClick={selectedTours.length > 0 ? handlePlaceOrder : null}
                                        style={{
                                            backgroundColor: selectedTours.length > 0 ? '#007bff' : '#ccc',
                                            cursor: selectedTours.length > 0 ? 'pointer' : 'not-allowed'
                                        }}>
                                        Оформить заказ
                                    </div>
                                }

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
                                    <h3>Участник {i + 1}</h3>
                                    <input
                                        type="text"
                                        placeholder="ФИО"
                                        value={passengerInfo[i]?.fullName || ""}
                                        onChange={(e) => handlePassengerInfoChange(i, "fullName", e.target.value)}
                                    />
                                    {/* <input
                                        type="email"
                                        placeholder="Почта"
                                        value={passengerInfo[i]?.email || ""}
                                        onChange={(e) => handlePassengerInfoChange(i, "email", e.target.value)}
                                    /> */}
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
                            {(paymentMethod === 'cash') ?
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
                                :
                                (isAgreed) ?
                                    <PaymentButton
                                        style={{}}
                                        order_name={selectedTourTitles}
                                        order_cost={totalCost * passengerCount}
                                        order_id={uniqueOrderId}
                                        onPaymentSuccess={handlePaymentSuccess}
                                    ></PaymentButton>
                                    :
                                    null}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Cart_Page;
