import React, { useEffect, useRef, useState } from 'react';
import classes from './Calendar.module.css';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

import server from '../../../serverConfig';

import PaymentButton from '../../PaymentButton/PaymentButton'
import axios from 'axios';

function Calendar({ children, hotel, rooms, closeModal, ...props }) {
    let token = localStorage.getItem('token');

    const [user, setUser] = useState();
    const [paymentID, setPaymentID] = useState('');

    const getUserInfo = async (token) => {
        if (token) {
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
        roomNumber: '-',
        arrivalDate: '',
        departureDate: '',
        userID: '',
        client: [
            {
                name: '',
                phone: '',
                email: '',
                address: '',
                passportNumber: '',
                passportSeries: '',
                gender: '',
                birthDate: ''
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
                        email: user.email,
                        address: user.address,
                        passportNumber: user.passportNumber,
                        passportSeries: user.passportSeries,
                        gender: user.gender,
                        birthDate: user.birthDate
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
        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    const handleAddBron = async (paymentID) => {
        // Проверка на заполненность данных
        if (
            bron.name !== '' &&
            bron.adress !== '' &&
            bron.guests !== '' &&
            bron.price !== '' &&
            bron.arrivalDate !== '' &&
            bron.departureDate !== '' &&
            bron.client[0].name !== '' &&
            bron.client[0].phone !== '' &&
            bron.client[0].email !== '' &&
            bron.client[0].address !== '' &&
            bron.client[0].passportNumber !== '' &&
            bron.client[0].passportSeries !== '' &&
            bron.client[0].gender !== '' &&
            bron.client[0].birthDate !== ''
        ) {
            setIsDisabled(true);

            // Проверка на наличие токена
            if (!token) {
                // Если токен не найден, регистрируем нового пользователя
                let formData = {
                    username: bron.client[0].phone,
                    password: generatePassword(12),
                    name: bron.client[0].name,
                    phone: bron.client[0].phone,
                    email: bron.client[0].email,
                    address: bron.client[0].address,
                    passportNumber: bron.client[0].passportNumber,
                    passportSeries: bron.client[0].passportSeries,
                    gender: bron.client[0].gender,
                    birthDate: bron.client[0].birthDate
                };

                try {
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

                        let forEmail = {
                            "to": formData.email,
                            "subject": "Данные для авторизации на сайте https://karstouristic.ru/",
                            "text": "",
                            "html": `<b>Логин:</b> ${formData.username} <br /> <b>Пароль:</b> ${formData.password}`
                        }

                        const responseEmail = await fetch(`${server}/api/send-email`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(forEmail)
                        });

                        setUser(data.user);

                        await processBooking(paymentID, data.user._id);
                    } else {
                        console.error('Ошибка регистрации');
                        return;
                    }
                } catch (error) {
                    console.error('Ошибка при регистрации:', error);
                    return;
                }
            } else {
                await processBooking(paymentID, user._id);
            }

            closeModal();
        } else {
            setIsDisabled(false);
            alert('Заполните все поля');
        }
    };

    const processBooking = async (paymentID, userId) => {
        let formData = {
            ...bron,
            userID: userId,
            paymentNumber: paymentID,
            hotel,
            rooms
        };

        try {
            const responseBron = await fetch(`${server}/api/addHotelBron`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (responseBron.ok) {
                const data = await responseBron.json();
                const emailPayload = {
                    ...formData,
                    bookingInfo: data,
                };
                const responseEmail = await fetch(`${server}/api/send-email-file-hotel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ formData: emailPayload })
                });

                // console.log('Бронирование успешно:', formData);
            } else {
                console.error('Ошибка при бронировании');
            }
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
        }
    };

    useEffect(() => {
        const calculateFullPrice = () => {
            if (bron.arrivalDate && bron.departureDate) {
                const arrivalDate = new Date(bron.arrivalDate);
                const departureDate = new Date(bron.departureDate);

                const differenceInTime = departureDate - arrivalDate;
                const numberOfDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1 || 1; // Количество дней

                const fullPrice = numberOfDays * bron.price * bron.guests;
                setBron((prev) => ({
                    ...prev,
                    fullPrice: fullPrice
                }));
            }
        };

        calculateFullPrice();
    }, [bron.arrivalDate, bron.departureDate, bron.guests, bron.price]);

    return (
        <div className={classes.calendar}>
            <h2>Бронирование номера</h2>
            <div className={classes.calendarSeparate}>
                <div className={classes.calendarSeparate_left}>
                    <div ref={calendarRef} className={classes.vanillaCalendar} />
                </div>
                <div className={classes.calendarSeparate_right}>
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
                                        <option value=''>Выберите номер</option>
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
                    </div>
                </div>
            </div>

            <h3>Информация о клиенте</h3>
            <div className={classes.calendarSeparate_right_item_client}>
                <div className={classes.formGroup}>
                    <label>ФИО клиента</label>
                    <input
                        type="text"
                        name="client.name"
                        placeholder="Введите ФИО клиента"
                        value={bron.client[0].name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={classes.formGroup}>
                    <label>Номер телефона</label>
                    <input
                        type="tel"
                        name="client.phone"
                        placeholder="Введите номер телефона"
                        value={bron.client[0].phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={classes.formGroup}>
                    <label>Почта</label>
                    <input
                        type="email"
                        name="client.email"
                        placeholder="Введите почту"
                        value={bron.client[0].email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={classes.formGroup}>
                    <label>Адрес</label>
                    <input
                        type="text"
                        name="client.address"
                        placeholder="Введите адрес"
                        value={bron.client[0].address}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={classes.formGroup}>
                    <label>Номер паспорта</label>
                    <input
                        type="text"
                        name="client.passportNumber"
                        placeholder="Введите номер паспорта"
                        value={bron.client[0].passportNumber}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={classes.formGroup}>
                    <label>Серия паспорта</label>
                    <input
                        type="text"
                        name="client.passportSeries"
                        placeholder="Введите серию паспорта"
                        value={bron.client[0].passportSeries}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={classes.formGroup}>
                    <label>Пол</label>
                    <select
                        name="client.gender"
                        value={bron.client[0].gender}
                        onChange={handleInputChange}
                    >
                        <option value=''>Выберите пол</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </select>
                </div>

                <div className={classes.formGroup}>
                    <label>Дата рождения</label>
                    <input
                        type="date"
                        name="client.birthDate"
                        value={bron.client[0].birthDate}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {(bron.price !== '' && bron.guests !== '') && <div className={classes.priceFull}>Итого к оплате: {bron.fullPrice}</div>}
            {
                (
                    bron.name !== '' &&
                    bron.adress !== '' &&
                    bron.guests !== '' &&
                    bron.price !== '' &&
                    bron.arrivalDate !== '' &&
                    bron.departureDate !== '' &&
                    bron.client[0].name !== '' &&
                    bron.client[0].phone !== '' &&
                    bron.client[0].email !== '' &&
                    bron.client[0].address !== '' &&
                    bron.client[0].passportNumber !== '' &&
                    bron.client[0].passportSeries !== '' &&
                    bron.client[0].gender !== '' &&
                    bron.client[0].birthDate !== ''
                )
                &&
                <PaymentButton
                    style={{}}
                    order_name={hotel.title}
                    order_cost={bron.fullPrice}
                    // order_id={uniqueOrderId}
                    setPaymentID={setPaymentID}
                    onPaymentSuccess={(paymentID) => handleAddBron(paymentID)}
                ></PaymentButton>
            }
        </div>
    );
}

export default Calendar;
