import React, { useEffect, useRef, useState } from 'react';
import classes from './CalendarAdmin.module.css';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

import server from '../../../serverConfig';

function CalendarAdmin({ children, hotels, allRooms, closeModal, fetchBronHotels, ...props }) {
    const calendarRef = useRef(null);

    const [hotelBrons, setHotelBrons] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null); // Состояние для выбранного отеля
    const [hotelRooms, setHotelRooms] = useState([]); // Состояние для хранения номеров выбранного отеля
    const [hotelRoomCountPlaces, setHotelRoomCountPlaces] = useState(1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [rooms, setRooms] = useState([]);

    const [bron, setBron] = useState({
        name: '',
        adress: '',
        guests: '1',
        price: '',
        fullPrice: '',
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

    const handleGetRoomsFromHotel = (idHotel) => {
        fetch(`${server}/api/getRooms?hotelId=${idHotel}`)
            .then(response => response.json())
            .then(data => {
                const sortedRooms = data.rooms.sort((a, b) => a.order - b.order);
                setRooms(sortedRooms);
            })
            .catch(error => console.error('Ошибка:', error));
    };

    // Функция для получения информации о бронированиях
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

    useEffect(() => {
        if (calendarRef.current && selectedHotel) {
            const filteredHotelBrons = hotelBrons.filter(hotelBron => hotelBron.name === selectedHotel.title);
            let disabledDates = [];

            filteredHotelBrons.forEach(bron => {
                disabledDates.push(`${bron.arrivalDate}:${bron.departureDate}`);
            });

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
    }, [hotelBrons, selectedHotel]);

    const handleHotelChange = (e) => {
        const hotelName = e.target.value;
        const hotel = hotels.find(h => h.title === hotelName);

        setSelectedHotel(hotel);

        if (hotel) {
            handleGetRoomsFromHotel(hotel._id);
        }

        setBron({
            name: hotel ? hotel.title : '',
            adress: hotel ? hotel.adress : '',
            guests: '1',
            price: hotel && hotel.type === 'apartments' ? hotel.price : '',
            fullPrice: hotel && hotel.type === 'apartments' ? hotel.price : '',
            roomNumber: 'none',
            arrivalDate: '',
            departureDate: '',
            userID: '6682a44e119b4f43ee5458b0',
            client: [
                {
                    name: '',
                    phone: '',
                    email: ''
                }
            ]
        });
    };

    const handleDateSelect = (selectedDates) => {
        setBron((prev) => ({
            ...prev,
            arrivalDate: selectedDates[0],
            departureDate: selectedDates.length === 1 ? selectedDates[0] : selectedDates[selectedDates.length - 1]
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
            setIsDisabled(true);

            let formData = bron;

            const responseBron = await fetch(`${server}/api/addHotelBron`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (responseBron.ok) {
                // console.log(formData);
                fetchBronHotels()
            } else {
                console.error('Ошибка регистрации');
            }

            closeModal();

        } else {
            setIsDisabled(false);
            alert('Заполните все поля');
        }
    };

    return (
        <div className={classes.calendar}>
            <h2>Бронирование номера</h2>
            <div className={classes.calendarSeparate}>
                {selectedHotel &&
                    <div className={classes.calendarSeparate_left}>
                        <div ref={calendarRef} className={classes.vanillaCalendar} />
                    </div>
                }

                <div className={classes.calendarSeparate_right}>
                    {selectedHotel &&
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
                    }

                    <div className={classes.calendarSeparate_right_item}>
                        <h3>Информация для бронирования</h3>

                        <div className={classes.formGroup}>
                            <label>Отель</label>
                            <select onChange={handleHotelChange}>
                                <option value="">Выберите отель</option>
                                {hotels.map((hotel, index) => (
                                    <option key={index} value={hotel.title}>
                                        {hotel.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedHotel && selectedHotel.type === 'hotel' && (
                            <div className={classes.formGroup}>
                                <label>Выберите номер</label>
                                <select
                                    name="roomNumber"
                                    value={bron.roomNumber}
                                    onChange={handleRoomChange}
                                >
                                    <option value="">Выберите номер</option>
                                    {rooms.map((room, index) => (
                                        <option key={index} value={room.title}>
                                            {room.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {(selectedHotel && selectedHotel.type === 'hotel' && bron.roomNumber !== '') && (
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

                        {(selectedHotel && selectedHotel.type === 'hotel' && bron.price !== '') && (
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

                        {(selectedHotel && selectedHotel.type === 'apartments') && (
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

                        {(selectedHotel && selectedHotel.type === 'apartments') && (
                            <div className={classes.formGroup}>
                                <label>Количество гостей</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={bron.guests}
                                    onChange={handleInputChange}
                                    max={selectedHotel.places}
                                    min={1}
                                />
                            </div>
                        )}

                        <br />
                        {(bron.price !== '' && bron.guests !== '') && <b>Итого к оплате: {bron.fullPrice}</b>}
                    </div>
                </div>
            </div>
            {selectedHotel &&
                <div className={classes.bookButton} onClick={handleAddBron}>
                    Забронировать отель
                </div>
            }
        </div>
    );
}

export default CalendarAdmin;
