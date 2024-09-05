import React, { useState, useEffect } from 'react';
import classes from './CalendarTour.module.css';
import server from '../../../serverConfig';

function CalendarTour({ closeModal, tour, selectedDate }) {
    const [passengerCount, setPassengerCount] = useState(1);
    const [passengerInfo, setPassengerInfo] = useState([{
        fullName: "",
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

    const token = localStorage.getItem('token');

    const getUserInfo = async () => {
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
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователя', error);
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
                        fullName: "",
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
    };

    const handleBooking = async () => {
        const formData = {
            price: totalCost,
            agent: user._id,
            paymentType: paymentMethod,
            tours: [tour],
            passengers: passengerInfo,
            bookingDate: selectedDate,
            bookingTime: tour.departureTime,
            confirm: paymentMethod === 'cash' ? false : true,
        };

        console.log(formData);

        // try {
        //     const response = await fetch(`${server}/api/addAgent`, {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         closeModal();
        //         alert('Бронирование успешно!');
        //     } else {
        //         alert('Ошибка при бронировании');
        //     }
        // } catch (error) {
        //     console.error('Ошибка при бронировании:', error);
        // }
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
            {user && (user.role == 'admin' || user.role == 'agent') &&
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
                        <h3>Участник {i + 1}</h3>

                        <div className={classes.passengerInfo_data}>
                            <div className={classes.field}>
                                <label>ФИО</label>
                                <input
                                    type="text"
                                    placeholder="Введите ФИО"
                                    value={passengerInfo[i]?.fullName || ""}
                                    onChange={(e) => handlePassengerInfoChange(i, "fullName", e.target.value)}
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

            <button
                onClick={handleBooking}
                disabled={!isAgreed}
                className={isAgreed ? classes.activeButton : classes.disabledButton}
            >
                Забронировать
            </button>
        </div>
    );
}

export default CalendarTour;




// (
//     bron.userID !== '' &&
//     bron.name !== '' &&
//     bron.adress !== '' &&
//     bron.guests !== '' &&
//     bron.price !== '' &&
//     bron.arrivalDate !== '' &&
//     bron.departureDate !== '' &&
//     bron.client[0].name !== '' &&
//     bron.client[0].phone !== '' &&
//     bron.client[0].email !== ''
// )
// &&
// <PaymentButton
//     style={{}}
//     order_name={hotel.title}
//     order_cost={bron.fullPrice}
//     // order_id={uniqueOrderId}
//     onPaymentSuccess={handleAddBron}
// ></PaymentButton>

// {user && (user.role == 'admin' || user.role == 'agent') &&
//     <div className={classes.field}>
//         <label>Количество пассажиров:</label>
//         <input
//             type="number"
//             min="1"
//             value={passengerCount}
//             onChange={handlePassengerCountChange}
//             className={classes.input}
//         />
//     </div>
// }