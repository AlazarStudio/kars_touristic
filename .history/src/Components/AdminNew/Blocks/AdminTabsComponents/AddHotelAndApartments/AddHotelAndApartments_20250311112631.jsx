import React, { useEffect, useState } from "react";
import classes from './AddHotelAndApartments.module.css';
import server from '../../../../../serverConfig';
import ReactModal from 'react-modal';
import CalendarAdmin from "../../../../Blocks/CalendarAdmin/CalendarAdmin";

// Устанавливаем корневой элемент для модального окна
ReactModal.setAppElement('#root');

function AddHotelAndApartments({ setActiveTab }) {
    const [bronHotels, setBronHotels] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hotel, setHotel] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // Загрузка списка отелей
    const fetchHotel = () => {
        fetch(`${server}/api/getHotels`)
            .then(response => response.json())
            .then(data => setHotel(data))
            .catch(error => console.error('Ошибка при загрузке отелей:', error));
    };

    useEffect(() => {
        fetchHotel();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Загрузка списка бронирований
    const fetchBronHotels = async () => {
        const response = await fetch(`${server}/api/getHotelBrons`);
        if (response.ok) {
            const data = await response.json();
            setBronHotels(data.hotelBron.reverse());
        } else {
            console.error('Ошибка при загрузке бронирований');
        }
    };

    useEffect(() => {
        fetchBronHotels();
    }, []);

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('ru-RU');
    }

    // Фильтрация списка по названию отеля
    const filteredHotels = bronHotels.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (searchDate ? formatDate(item.createdAt) === formatDate(searchDate) : true)
    );

    // Обработчик выбора всех записей
    const handleSelectAll = () => {
        if (selectedItems.length === filteredHotels.length) {
            setSelectedItems([]); // Если уже выбраны все, снимаем выделение
        } else {
            setSelectedItems(filteredHotels.map(item => item._id)); // Выбираем все
        }
    };

    // Обработчик выбора конкретной записи
    const handleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Удаление выбранных бронирований
    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return alert("Выберите записи для удаления!");

        if (window.confirm("Вы уверены, что хотите удалить выбранные бронирования?")) {
            for (const id of selectedItems) {
                try {
                    await fetch(`${server}/api/deleteHotelBron/${id}`, { method: 'DELETE' });
                } catch (error) {
                    console.error(`Ошибка при удалении брони ${id}`, error);
                }
            }
            fetchBronHotels();
            setSelectedItems([]);
        }
    };

    return (
        <div className={classes.multidayTours}>
            <div className={classes.multidayTours_top}>
                <div className={classes.multidayTours_top__title}>Брони Отелей / Апартаментов</div>
            </div>

            <div className={classes.gids}>
                <div className={classes.gids_menu}>
                    <
                    <button onClick={handleSelectAll}>
                        {selectedItems.length === filteredHotels.length ? "Снять выделение" : "Выбрать все"}
                    </button>
                    <button className={classes.multidayTours_top__add} onClick={openModal}>Забронировать отель</button>
                    <input 
                        type="text" 
                        placeholder="Поиск по названию" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input 
                        type="date" 
                        value={searchDate} 
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <button onClick={handleDeleteSelected}>Удалить выбранное</button>
                </div>

                <div className={classes.gids_info}>
                    <div className={classes.gids_info_data}>
                        <div className={classes.gids_info__elem}><b>Выбрать</b></div>
                        <div className={classes.gids_info__elem}><b>Дата брони</b></div>
                        <div className={classes.gids_info__elem}><b>Название отеля</b></div>
                        <div className={classes.gids_info__elem}><b>Гости</b></div>
                        <div className={classes.gids_info__elem}><b>Полная цена</b></div>
                        <div className={classes.gids_info__elem}><b>Дата заезда - выезда</b></div>
                        <div className={classes.gids_info__elem}><b>Удалить</b></div>
                    </div>
                </div>

                {filteredHotels.length > 0 ? (
                    filteredHotels.map((item, index) => (
                        <div className={classes.gids_info} key={index}>
                            <div className={classes.gids_info__elem}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => handleSelectItem(item._id)}
                                />
                            </div>
                            <div className={classes.gids_info__elem}>{formatDate(item.createdAt)}</div>
                            <div className={classes.gids_info__elem}>{item.name}</div>
                            <div className={classes.gids_info__elem}>{item.guests}</div>
                            <div className={classes.gids_info__elem}>{Number(item.fullPrice).toLocaleString('ru-RU')} ₽</div>
                            <div className={classes.gids_info__elem}>{formatDate(item.arrivalDate)} - {formatDate(item.departureDate)}</div>
                            <div className={classes.gids_info__elem} onClick={() => handleSelectItem(item._id)}>
                                <button className={classes.bookButton} onClick={() => handleSelectItem(item._id)}>Удалить</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={classes.noResults}>Нет доступных бронирований</div>
                )}
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
