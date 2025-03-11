import React, { useEffect, useState } from "react";
import classes from './AddHotelAndApartments.module.css';
import server from '../../../../../serverConfig';
import { useNavigate, Link } from "react-router-dom";
import ReactModal from 'react-modal';
import CalendarAdmin from "../../../../Blocks/CalendarAdmin/CalendarAdmin";

// Устанавливаем корневой элемент для модального окна
ReactModal.setAppElement('#root');

function AddHotelAndApartments({ setActiveTab }) {
    const [bronHotels, setBronHotels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [hotel, setHotel] = useState([]);

    const fetchHotel = () => {
        fetch(`${server}/api/getHotels`)
            .then(response => response.json())
            .then(data => setHotel(data))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchHotel();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchBronHotels = async () => {
        const response = await fetch(`${server}/api/getHotelBrons`);
        if (response.ok) {
            const data = await response.json();
            setBronHotels(data.hotelBron.reverse());
        } else {
            console.error('Failed to fetch BronHotels');
        }
    };

    useEffect(() => {
        fetchBronHotels();
    }, []);

    function formatDate(isoDate) {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    const handleRemovePhoto = async (id) => {
        if (confirm("Вы уверены, что хотите удалить бронирование?")) {
            try {
                const response = await fetch(`${server}/api/deleteHotelBron/${id}`, {
                    method: 'delete',
                });

                if (response.ok) {
                    fetchBronHotels();
                }
            } catch (error) {
                console.error('Error updating photos', error);
            }
        }
    };

    return (
        <div className={classes.multidayTours}>
            <div className={classes.multidayTours_top}>
                <div className={classes.multidayTours_top__title}>Брони Отелей / Апартаментов</div>
                {/* <button className={classes.multidayTours_top__add} onClick={openModal}>Забронировать отель</button> */}
            </div>

            <div className={classes.gids}>
                <div className={classes.gids_menu}>
                    <button></button>
        <button className={classes.multidayTours_top__add} onClick={openModal}>Забронировать отель</button>
                </div>
                <div className={classes.gids_info}>
                    <div className={classes.gids_info_data}>
                        <div className={classes.gids_info__elem}><b>Дата брони</b></div>
                        <div className={classes.gids_info__elem}><b>Название отеля</b></div>
                        <div className={classes.gids_info__elem}><b>Гости</b></div>
                        <div className={classes.gids_info__elem}><b>Полная цена</b></div>
                        <div className={classes.gids_info__elem}><b>Дата заезда - выезда</b></div>
                        <div className={classes.gids_info__elem}><b className={classes.bookButtonTitle}>Удалить</b></div>
                    </div>
                </div>
                {bronHotels.length > 0 ?
                    bronHotels.map((item, index) => (
                        <div className={classes.gids_info} key={index}>
                            <div className={classes.gids_info__elem}>{formatDate(item.createdAt)}</div>
                            <div className={classes.gids_info__elem}>{item.name}</div>
                            <div className={classes.gids_info__elem}>{item.guests}</div>
                            <div className={classes.gids_info__elem}>{Number(item.fullPrice).toLocaleString('ru-RU')} ₽</div>
                            <div className={classes.gids_info__elem}>{formatDate(item.arrivalDate)} - {formatDate(item.departureDate)}</div>
                            <div className={classes.gids_info__elem} onClick={() => handleRemovePhoto(item._id)}>
                                <div className={classes.bookButton}>Удалить</div>
                            </div>
                        </div>
                    ))
                    :
                    null
                }
            </div>

            {/* Модальное окно */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Бронирование номера"
                className={classes.customModal}
                overlayClassName={classes.customOverlay}
            >
                <CalendarAdmin closeModal={closeModal} hotels={hotel.hotels} fetchBronHotels={fetchBronHotels} />
                <button onClick={closeModal} className={classes.modalCloseButton}>&#x2715;</button>
            </ReactModal>
        </div>
    );
}

export default AddHotelAndApartments;
