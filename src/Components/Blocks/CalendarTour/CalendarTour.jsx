import React, { useState, useEffect, useRef } from 'react';
import classes from './CalendarTour.module.css';
import server from '../../../serverConfig';
import PaymentButton from '../../PaymentButton/PaymentButton';
import VanillaCalendar from 'vanilla-calendar-pro';
import ConfirmBookingModal from '../ConfirmBookingModal/ConfirmBookingModal';

function CalendarTour({ closeModal, tour, selectedDate }) {
    const [passengerCount, setPassengerCount] = useState(0);
    const [passengerInfo, setPassengerInfo] = useState([]);

    const [tourDay, setTourDay] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isAgreed, setIsAgreed] = useState(false);
    const [user, setUser] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [fieldsToUpdate, setFieldsToUpdate] = useState({});
    const [paymentID, setPaymentID] = useState('');

    const [newUser, setNewUser] = useState(null);

    const token = localStorage.getItem('token');

    const getUserInfo = async () => {
        if (token) {
            try {
                const response = await fetch(`${server}/api/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    if (data.role === 'user') {
                        setPassengerInfo([{
                            name: data.name || "",
                            email: data.email || "",
                            phone: data.phone || "",
                            address: data.address || "",
                            passportNumber: data.passportNumber || "",
                            passportSeries: data.passportSeries || "",
                            gender: data.gender || "",
                            birthDate: data.birthDate || ""
                        }]);
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке пользователя', error);
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        setTotalCost(parseFloat(tour.cost.replace(/\s/g, '')) * passengerCount);
    }, [passengerCount, tour]);

    const handlePassengerCountChange = (e) => {
        const count = parseInt(e.target.value);
        setPassengerInfo(prevInfo => {
            const newInfo = [...prevInfo];
            if (count > prevInfo.length) {
                for (let i = prevInfo.length; i < count; i++) {
                    newInfo.push({
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        passportNumber: "",
                        passportSeries: "",
                        gender: "",
                        birthDate: ""
                    });
                }
            } else {
                newInfo.splice(count);
            }
            return newInfo;
        });

        if (tour.days.length > 1 && count < 2) {
            alert('Бронирование многодневных туров доступно при оформлении минимум на 2-х человек')
            setPassengerCount(2);
        } else {
            setPassengerCount(count);
        }
    };

    const handlePassengerInfoChange = (index, field, value) => {
        setPassengerInfo(prevInfo => {
            const newInfo = [...prevInfo];
            if (!newInfo[index]) {
                // Если по какой-то причине объект не существует, создаем его
                newInfo[index] = {
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    passportNumber: "",
                    passportSeries: "",
                    gender: "",
                    birthDate: ""
                };
            }
            newInfo[index][field] = value;
            return newInfo;
        });

        if (fieldsToUpdate[field]) {
            setFieldsToUpdate(prevState => ({
                ...prevState,
                [field]: true
            }));
        }
    };

    const updateUserFields = async () => {
        // Создаем объект обновлений, включающий только измененные данные
        const updates = {};
        const passenger = passengerInfo[0];  // Данные основного пассажира (текущего пользователя)

        Object.keys(fieldsToUpdate).forEach((field) => {
            if (fieldsToUpdate[field] && passenger[field]) {
                updates[field] = passenger[field];
            }
        });

        // Если есть поля для обновления, отправляем запрос
        if (Object.keys(updates).length > 0) {
            try {
                const response = await fetch(`${server}/api/userUpdate`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
                if (!response.ok) {
                    throw new Error('Failed to update user.');
                }

                return await response.json();
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        }
    };

    function generatePassword(length = 8) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    const handleBooking = async (paymentID) => {
        if (!token) {
            // Регистрация нового пользователя
            let formData = {
                username: passengerInfo[0].phone,
                password: generatePassword(12),
                name: passengerInfo[0].name,
                phone: passengerInfo[0].phone,
                email: passengerInfo[0].email,
                address: passengerInfo[0].address,
                passportNumber: passengerInfo[0].passportNumber,
                passportSeries: passengerInfo[0].passportSeries,
                gender: passengerInfo[0].gender,
                birthDate: passengerInfo[0].birthDate,
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

                    await bookTour(paymentID, data.user._id);

                } else {
                    console.error('Ошибка регистрации');
                    return;
                }
            } catch (error) {
                console.error('Ошибка при регистрации:', error);
                return;
            }
        } else {
            if (user && (user.role == 'agent' || user.role == 'admin')) {
                let formData = {
                    username: passengerInfo[0].phone,
                    password: generatePassword(12),
                    name: passengerInfo[0].name,
                    phone: passengerInfo[0].phone,
                    email: passengerInfo[0].email,
                    address: passengerInfo[0].address,
                    passportNumber: passengerInfo[0].passportNumber,
                    passportSeries: passengerInfo[0].passportSeries,
                    gender: passengerInfo[0].gender,
                    birthDate: passengerInfo[0].birthDate,
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

                        await updateUserFields();
                        await bookTour(paymentID, data.user._id);

                    } else {
                        console.error('Ошибка регистрации:', error);
                        return;
                    }
                } catch (error) {
                    console.error('Ошибка при регистрации:', error);
                    return;
                }
            } else {
                await updateUserFields();
                await bookTour(paymentID);
            }
        }
    };

    const bookTour = async (paymentID, newRegUserId) => {
        const userId = user ? user._id : newRegUserId;

        const formData = {
            price: totalCost,
            agent: userId,
            bronTypeRole: user && user.role === 'agent' ? 'agent' : 'user',
            paymentType: paymentMethod,
            tours: [tour],
            passengers: passengerInfo,
            bookingDate: tourDay[0], // одна выбранная дата

            bookingTime: tour.departureTime,
            confirm: paymentMethod === 'cash' ? false : true,
        };

        if (paymentMethod === 'cash') {
            let debtUser = user.debt + totalCost;
            await fetch(`${server}/api/userUpdate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ debt: debtUser })
            });
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
                const data = await response.json();

                const emailPayload = {
                    ...formData,
                    bookingInfo: data,
                    paymentNumber: paymentID,
                    user
                };

                console.log(emailPayload);

                const responseEmail = await fetch(`${server}/api/send-email-file`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ formData: emailPayload })
                });

                closeModal();
                alert('Бронирование успешно!');
            } else {
                const errorData = await response.json();
                alert('Ошибка при бронировании: ' + errorData.message);
            }
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
            alert('Ошибка при бронировании: ' + error.message);
        }
    };

    function formatDateRange(dateRange) {
        if (!dateRange) return '';

        const [startDate, endDate] = dateRange.split(' - ');

        const formatDate = (date) => {
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`;
        };

        const formattedStartDate = formatDate(startDate);

        if (endDate) {
            const formattedEndDate = formatDate(endDate);
            return `${formattedStartDate} - ${formattedEndDate}`;
        } else {
            return formattedStartDate;
        }
    }

    const sendRequestFromUser = async () => {
        const formData = {
            price: totalCost,
            agent: 'Заявка с сайта',
            bronTypeRole: 'Заявка с сайта',
            paymentType: 'Заявка с сайта',
            tours: [tour],
            passengers: passengerInfo,
            bookingDate: tourDay[0], // одна выбранная дата

            bookingTime: tour.departureTime,
            confirm: false,
        };

        let forEmail = {
            "to": 'kars-touristic@mail.ru',
            "subject": "Заявка с сайта на тур",
            "text": "",
            "html": `
            <b>ИНФОРМАЦИЯ О ТУРЕ:</b> 

            <br/><br/>

            <b>Название тура:</b> ${formData.tours[0].tourTitle} <br/>
            <b>Дата тура:</b> ${formatDateRange(formData.bookingDate)} <br/>
            <b>Cпособ передвижения:</b> ${formData.tours[0].travelMethod} <br/>
            <b>Продолжительность:</b> ${formData.tours[0].duration} <br/>
            <b>Время отправления:</b> ${formData.tours[0].departureTime} <br/>
            <b>Тип экскурсии:</b> ${formData.tours[0].tourType} <br/>
            <b>Сложность:</b> ${formData.tours[0].difficulty} <br/>
            <b>Стоимость:</b> ${formData.price} 

            <br/><br/>

            <b>ИНФОРМАЦИЯ О ПАССАЖИРЕ:</b> 

            <br/><br/>

            <b>ФИО:</b> ${formData.passengers[0].name} <br/>
            <b>Почта:</b> ${formData.passengers[0].email} <br/>
            <b>Телефон:</b> ${formData.passengers[0].phone} <br/>
            <b>Адрес:</b> ${formData.passengers[0].address} <br/>
            <b>Паспортные данные:</b> ${formData.passengers[0].passportNumber} ${formData.passengers[0].passportSeries}<br/>
            <b>Пол:</b> ${formData.passengers[0].gender} <br/>
            <b>Дата рождения:</b> ${formData.passengers[0].birthDate}

            <br/><br/>

            <a href="${window.location.href}" target="_blank">ССЫЛКА НА ТУР</a>
            `
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
                const responseEmail = await fetch(`${server}/api/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(forEmail)
                });

                if (responseEmail.ok) {
                    closeModal();
                    alert('Заявка отправлена. Наш оператор в скором времени свяжется с Вами!');
                }
            } else {
                const errorData = await response.json();
                alert('Ошибка при бронировании: ' + errorData.message);
            }
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
            alert('Ошибка при бронировании: ' + error.message);
        }

    }

    const validateForm = () => {
        if (tourDay.length === 0) {
            alert("Пожалуйста, выберите дату отправления.");
            return false;
        }

        if (passengerCount === 0) {
            alert("Пожалуйста, введите количество участников тура.");
            return false;
        }

        // console.log(passengerInfo)

        for (let i = 0; i < passengerInfo.length; i++) {
            const passenger = passengerInfo[i];
            const requiredFields = ["name", "email", "phone", "address", "passportNumber", "passportSeries", "gender", "birthDate"];
            const requiredFieldsRu = {
                "name": "ФИО",
                "email": "Почта",
                "phone": "Телефон",
                "address": "Адрес",
                "passportNumber": "Номер паспорта",
                "passportSeries": "Серия паспорта",
                "gender": "Пол",
                "birthDate": "Дата рождения"
            };
            for (let field of requiredFields) {
                if (!passenger[field] || passenger[field].trim() === "") {
                    alert(`Пожалуйста, заполните поле "${requiredFieldsRu[field]}" для участника ${i + 1}.`);
                    return false;
                }
            }
        }

        return true;
    };

    const extractAmount = (input) => {
        if (!input) return null;

        const sanitizedInput = String(input).replace(/\s/g, '').replace(/\.(?=\d{3})/g, '').replace(/,/g, '.');

        const match = sanitizedInput.match(/\d+(\.\d+)?/);
        if (!match) return null;

        const amount = parseFloat(match[0]);

        return `${amount.toLocaleString('ru-RU')} ₽`;
    };

    const calendarRef = useRef(null);

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
                    },
                    selection: {
                        day: 'single',
                    }
                },
                actions: {
                    clickDay: (event, self) => {
                        const selectedDates = self.selectedDates;
                        setTourDay(selectedDates);
                    }
                }
            };

            const calendar = new VanillaCalendar(calendarRef.current, options);
            calendar.init();
        }
    }, []);

    // console.log(passengerCount, passengerInfo, tourDay)
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={classes.calendar}>
            <div className={classes.calendar_left}>
                <div className={classes.calendar_left_title}>Бронирование тура</div>

                <div className={classes.calendar_left_dates}>
                    <div className={classes.calendar_left_dates_title}>
                        Выберите дату отправления
                    </div>
                    <div ref={calendarRef} className={classes.vanillaCalendar} />
                </div>

                <div className={classes.calendar_left_count}>
                    <div className={classes.calendar_left_count_title}>
                        Бронирование многодневных туров доступно при оформлении минимум на 2-х человек
                    </div>
                    <div className={classes.calendar_left_count_select}>
                        <label>Количество пассажиров:</label>
                        <input
                            type="number"
                            min={tour.days.length > 1 ? 2 : 1}
                            value={passengerCount}
                            onChange={handlePassengerCountChange}
                            className={classes.input}
                        />
                    </div>
                </div>

                <div className={classes.calendar_left_price}>
                    <div className={classes.calendar_left_price_forOne}>
                        <div>Стоимость тура:</div>
                        <div>{extractAmount(tour.cost)}</div>
                    </div>
                    <div className={classes.calendar_left_price_full}>
                        <div>Итоговая сумма:</div>
                        <div>{extractAmount(totalCost)}</div>
                    </div>
                </div>

                <div className={classes.calendar_left_send}>
                    <button className={classes.calendar_left_send_button} onClick={() => {
                        if (!validateForm()) return;
                        setModalOpen(true)
                    }}>
                        Забронировать
                    </button>
                </div>
            </div>

            {passengerCount > 0 &&
                <div className={classes.calendar_right}>
                    <div className={classes.calendar_right_scroll}>
                        {Array.from({ length: passengerCount }, (_, i) => (
                            <div key={i} className={classes.passengerInfo}>
                                <h3>{(user && i == 0) ? 'Данные текущего пользователя' : `Данные участника ${i + 1}`}</h3>

                                <div className={classes.passengerInfo_data}>
                                    <div className={classes.field}>
                                        <label>ФИО</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="text"
                                            placeholder="Введите ФИО"
                                            value={passengerInfo[i]?.name || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "name", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Почта</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="email"
                                            placeholder="Введите почту"
                                            value={passengerInfo[i]?.email || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "email", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Телефон</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="text"
                                            placeholder="Введите номер телефона"
                                            value={passengerInfo[i]?.phone || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "phone", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Адрес</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="text"
                                            placeholder="Введите адрес"
                                            value={passengerInfo[i]?.address || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "address", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Номер паспорта</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="text"
                                            placeholder="Введите номер паспорта"
                                            value={passengerInfo[i]?.passportNumber || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "passportNumber", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Серия паспорта</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="text"
                                            placeholder="Введите серию паспорта"
                                            value={passengerInfo[i]?.passportSeries || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "passportSeries", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <label>Пол</label>
                                        <select
                                            disabled={tourDay.length === 0 ? true : false}
                                            value={passengerInfo[i]?.gender || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "gender", e.target.value)}
                                            className={classes.input}
                                        >
                                            <option value="">Выберите пол</option>
                                            <option value="male">Мужской</option>
                                            <option value="female">Женский</option>
                                        </select>
                                    </div>

                                    <div className={classes.field}>
                                        <label>Дата рождения</label>
                                        <input
                                            disabled={tourDay.length === 0 ? true : false}
                                            type="date"
                                            value={passengerInfo[i]?.birthDate || ""}
                                            onChange={(e) => handlePassengerInfoChange(i, "birthDate", e.target.value)}
                                            className={classes.input}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div >
                </div >
            }

            <ConfirmBookingModal
                open={modalOpen}
                user={user}
                tour={tour}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                isAgreed={isAgreed}
                paymentID={paymentID}
                setPaymentID={setPaymentID}
                setIsAgreed={setIsAgreed}
                handleBooking={handleBooking}
                sendRequestFromUser={sendRequestFromUser}
                totalCost={totalCost}

                handleClose={() => setModalOpen(false)}
                handleConfirm={() => {
                    // setModalOpen(false);
                }}
            />

        </div >










        // </div>
    );
}

export default CalendarTour;