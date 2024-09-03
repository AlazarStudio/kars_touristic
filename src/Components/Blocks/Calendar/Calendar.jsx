import React, { useEffect, useRef, useState } from 'react';
import classes from './Calendar.module.css';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

import server from '../../../serverConfig';

import PaymentButton from '../../PaymentButton/PaymentButton'

function Calendar({ children, hotel, rooms, closeModal, ...props }) {
    let token = localStorage.getItem('token');

    const onPaymentSuccess = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('../../../../public/php/send_mail file.php', new URLSearchParams(form));
            alert(response.data);
            setForm({
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            alert('Произошла ошибка при отправке сообщения.');
        }
    };

    const [user, setUser] = useState();

    const getUserInfo = async (token) => {
        const response = await fetch(`${server}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            localStorage.removeItem('token');
            console.error('Ошибка получения информации о пользователе');
        }
    };

    useEffect(() => {
        if (token) {
            getUserInfo(token);
        }
    }, [token]);

    const calendarRef = useRef(null);

    const [hotelBrons, setHotelBrons] = useState([]);

    const getHotelBronsInfo = async () => {
        try {
            const response = await fetch(`${server}/api/getHotelBrons`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const hotelBronsData = await response.json();
                setHotelBrons(hotelBronsData.hotelBron.reverse());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHotelBronsInfo();
    }, []);

    const filteredHotelBrons = hotelBrons.filter(hotelBron => hotelBron.name === hotel.title);

    let disabledDates = [];

    filteredHotelBrons.forEach(bron => {
        disabledDates.push(`${bron.arrivalDate}:${bron.departureDate}`);
    });

    const [isDisabled, setIsDisabled] = useState(false)

    const [bron, setBron] = useState({
        name: hotel ? hotel.title : '',
        adress: hotel ? hotel.adress : '',
        guests: '1',
        price: hotel && hotel.type == 'apartments' ? hotel.price : '',
        fullPrice: hotel && hotel.type == 'apartments' ? hotel.price : '',
        roomNumber: 'none',
        arrivalDate: '',
        departureDate: '',
        userID: '',
        client: [
            {
                name: '',
                phone: '',
                email: ''
            }
        ]
    });

    useEffect(() => {
        if (user) {
            setBron((prev) => ({
                ...prev,
                userID: user._id,
                client: [
                    {
                        name: user.name,
                        phone: user.phone,
                        email: user.email
                    }
                ],
            }));
        }
    }, [user]);

    const [hotelRoomCountPlaces, setHotelRoomCountPlaces] = useState(1);

    useEffect(() => {
        if (calendarRef.current) {
            const options = {
                settings: {
                    lang: 'ru',
                    iso8601: true,
                    visibility: {
                        theme: 'light',
                        daysOutside: false,
                    },
                    range: {
                        disableGaps: true,
                        disablePast: true,
                        disabled: disabledDates,
                    },
                    selection: {
                        day: 'multiple-ranged',
                    }
                },
                actions: {
                    clickDay: (event, self) => {
                        const selectedDates = self.selectedDates;
                        handleDateSelect(selectedDates);
                    }
                }
            };

            const calendar = new VanillaCalendar(calendarRef.current, options);
            calendar.init();
        }
    }, [hotelBrons]);

    const handleDateSelect = (selectedDates) => {
        setBron((prev) => ({
            ...prev,
            arrivalDate: selectedDates[0],
            departureDate: selectedDates.length == 1 ? selectedDates[0] : selectedDates[selectedDates.length - 1]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('client')) {
            setBron((prev) => ({
                ...prev,
                client: [
                    {
                        ...prev.client[0],
                        [name.split('.')[1]]: value,
                    }
                ]
            }));
        } else {
            setBron((prev) => ({
                ...prev,
                [name]: value,
                fullPrice: name === 'guests' ? prev.price * value : prev.fullPrice
            }));
        }
    };

    const handleRoomChange = (e) => {
        const selectedRoomNumber = e.target.value;
        const selectedRoom = rooms.find(room => room.title === selectedRoomNumber);

        setBron((prev) => ({
            ...prev,
            roomNumber: selectedRoomNumber,
            price: selectedRoom ? selectedRoom.price : '',
            fullPrice: selectedRoom ? selectedRoom.price * prev.guests : ''
        }));
        setHotelRoomCountPlaces(selectedRoom ? selectedRoom.places : '1');
    };

    function generatePassword(length = 8) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    const handleAddBron = async () => {
        if (
            bron.userID !== '' &&
            bron.name !== '' &&
            bron.adress !== '' &&
            bron.guests !== '' &&
            bron.price !== '' &&
            bron.arrivalDate !== '' &&
            bron.departureDate !== '' &&
            bron.client[0].name !== '' &&
            bron.client[0].phone !== '' &&
            bron.client[0].email !== ''
        ) {
            setIsDisabled(true)

            let formData = bron;

            const responseBron = await fetch(`${server}/api/addHotelBron`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (responseBron.ok) {
                console.log(formData)
            } else {
                console.error('Ошибка регистрации');
            }

            if (!token) {
                let formData = {
                    username: bron.client[0].email,
                    password: generatePassword(12),
                    name: bron.client[0].name,
                    phone: bron.client[0].phone,
                    email: bron.client[0].email
                }

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

                    console.log(formData)
                } else {
                    console.error('Ошибка регистрации');
                }
            }

            closeModal()

        } else {
            setIsDisabled(false)
            alert('Заполните все поля')
        }
    }

    return (
        <div className={classes.calendar}>
            <h2>Бронирование номера</h2>
            <div className={classes.calendarSeparate}>
                <div className={classes.calendarSeparate_left}>
                    <div ref={calendarRef} className={classes.vanillaCalendar} />
                </div>
                <div className={classes.calendarSeparate_right}>
                    <div className={classes.calendarSeparate_right_item}>
                        <h3>Информация о клиенте</h3>
                        <div className={classes.formGroup}>
                            <label>ФИО клиента</label>
                            <input
                                type="text"
                                name="client.name"
                                value={bron.client[0].name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label>Номер телефона</label>
                            <input
                                type="tel"
                                name="client.phone"
                                value={bron.client[0].phone}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={classes.formGroup}>
                            <label>Почта</label>
                            <input
                                type="email"
                                name="client.email"
                                value={bron.client[0].email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={classes.calendarSeparate_right_item}>
                        <h3>Информация для бронирования</h3>
                        {hotel?.type === 'hotel' &&

                            (

                                <div className={classes.formGroup}>
                                    <label>Выберите номер</label>
                                    <select
                                        name="roomNumber"
                                        value={bron.roomNumber}
                                        onChange={handleRoomChange}
                                    >
                                        <option value="">Выберите номер</option>
                                        {rooms && rooms.map((room, index) => (
                                            <option key={index} value={room.title}>
                                                {room.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        {(hotel?.type === 'hotel' && bron.roomNumber !== '') && (
                            <div className={classes.formGroup}>
                                <label>Количество гостей</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={bron.guests}
                                    onChange={handleInputChange}
                                    max={hotelRoomCountPlaces}
                                    min={1}
                                />
                            </div>
                        )}

                        {(hotel?.type === 'hotel' && bron.price !== '') && (
                            <div className={classes.formGroup}>
                                <label>Стоимость в сутки на одного</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={bron.price}
                                    readOnly
                                />
                            </div>
                        )}

                        {(hotel?.type === 'apartments') && (
                            <div className={classes.formGroup}>
                                <label>Стоимость в сутки на одного</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={bron.price}
                                    readOnly
                                />
                            </div>
                        )}

                        {(hotel?.type === 'apartments') && (
                            <div className={classes.formGroup}>
                                <label>Количество гостей</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={bron.guests}
                                    onChange={handleInputChange}
                                    max={hotel.places}
                                    min={1}
                                />
                            </div>
                        )}

                        <br />
                        {(bron.price !== '' && bron.guests !== '') && <b>Итого к оплате: {bron.fullPrice} ₽</b>}
                    </div>
                </div>
            </div>
            <PaymentButton
                style={{}}
                order_name={hotel.title}
                order_cost={bron.fullPrice}
                // order_id={uniqueOrderId}
                onPaymentSuccess={onPaymentSuccess}
            ></PaymentButton>
            <div className={classes.bookButton} onClick={handleAddBron}>
                Перейти к оплате
            </div>
        </div>
    );
}

export default Calendar;
