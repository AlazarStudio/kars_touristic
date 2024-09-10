import React, { useState, useEffect } from 'react';
import classes from './CalendarTour.module.css';
import server from '../../../serverConfig';
import PaymentButton from '../../PaymentButton/PaymentButton';

function CalendarTour({ closeModal, tour, selectedDate }) {
    const [passengerCount, setPassengerCount] = useState(1);
    const [passengerInfo, setPassengerInfo] = useState([{
        name: "",
        email: "",
        phone: "",
        address: "",
        passportNumber: "",
        passportSeries: "",
        gender: "",
        birthDate: ""
    }]);

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
        setPassengerCount(count);
    };

    const handlePassengerInfoChange = (index, field, value) => {
        setPassengerInfo(prevInfo => {
            const newInfo = [...prevInfo];
            newInfo[index][field] = value;
            return newInfo;
        });

        // Если поле изначально было пустым и теперь заполнено, помечаем его для обновления
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


                    console.log(data.user._id);
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
            await updateUserFields();
            await bookTour(paymentID);  // Здесь должна выполняться bookTour
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
            bookingDate: selectedDate,
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
                    paymentNumber: paymentID
                };

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

    return (
        <div className={classes.calendar}>
            <h2>Бронирование тура на дату: {formatDateRange(selectedDate)}</h2>

            {user && (user.role == 'agent' || user.role == 'admin') &&
                <div className={classes.field}>
                    <label>Количество пассажиров:</label>
                    <input
                        type="number"
                        min="1"
                        value={passengerCount}
                        onChange={handlePassengerCountChange}
                        className={classes.input}
                    />
                </div>
            }

            <div className={classes.passengerBlock}>
                {Array.from({ length: passengerCount }, (_, i) => (
                    <div key={i} className={classes.passengerInfo}>
                        {user && (user.role == 'agent' || user.role == 'admin') && <h3>Участник {i + 1}</h3>}

                        <div className={classes.passengerInfo_data}>
                            <div className={classes.field}>
                                <label>ФИО</label>
                                <input
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
                                    type="date"
                                    value={passengerInfo[i]?.birthDate || ""}
                                    onChange={(e) => handlePassengerInfoChange(i, "birthDate", e.target.value)}
                                    className={classes.input}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {user && (user.role == 'agent' || user.role == 'admin') &&
                <>
                    <h3>Выберите способ оплаты</h3>
                    <div className={classes.paymentMethods}>
                        <label className={classes.radioLabel}>
                            <input
                                type="radio"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={classes.radioInput}
                            />
                            Карта
                        </label>
                        <label className={classes.radioLabel}>
                            <input
                                type="radio"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className={classes.radioInput}
                            />
                            Наличные
                        </label>
                    </div>
                </>
            }

            <div className={classes.totalSum}>
                Итоговая сумма: {totalCost} ₽
            </div>

            <div className={classes.agreement}>
                <input
                    type="checkbox"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className={classes.checkbox}
                />
                <p>Согласен с правилами бронирования</p>
            </div>

            {/* <button
                onClick={handleBooking}
                disabled={!isAgreed}
                className={isAgreed ? classes.activeButton : classes.disabledButton}
            >
                Забронировать
            </button> */}
            {isAgreed &&
                <PaymentButton
                    style={{}}
                    order_name={tour.tourTitle}
                    order_cost={totalCost}
                    setPaymentID={setPaymentID}
                    onPaymentSuccess={(paymentID) => handleBooking(paymentID)}
                />
            }

        </div>
    );
}

export default CalendarTour;