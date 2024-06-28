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

    let cartMass = user ? user.cart : [];

    const filteredMultidayTours = multidayTours.length > 0 ? multidayTours.filter(tour => cartMass.includes(tour._id)) : [];
    const filteredOnedayTours = onedayTours.length > 0 ? onedayTours.filter(tour => cartMass.includes(tour._id)) : [];

    let data = filteredMultidayTours.concat(filteredOnedayTours);

    const totalCost = selectedTours.reduce((acc, tour) => acc + parseFloat(tour.cost.replace(/\s/g, '')), 0);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
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
                                                    <div className={classes.cartPage_left__data___elem____objectData___info}>
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
                                <div className={classes.cartPage_right__button}>Оформить заказ</div>
                                <div className={classes.cartPage_right__oferta}>
                                    <label>
                                        <input type="radio" />
                                        <p>Согласен с условиями Правил пользования торговой площадкой и правилами возврата</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Cart_Page;
