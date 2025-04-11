import React, { useEffect, useState } from 'react';
import classes from './AddHotelAndApartments.module.css';
import server from '../../../../../serverConfig';
import ReactModal from 'react-modal';
import CalendarAdmin from '../../../../Blocks/CalendarAdmin/CalendarAdmin';
import { useLocation } from 'react-router-dom';

// Устанавливаем корневой элемент для модального окна
ReactModal.setAppElement('#root');

function AddHotelAndApartments({ setActiveTab, user }) {
  const [bronHotels, setBronHotels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotel, setHotel] = useState([]);
  const [searchQuery, setSearchQuery] = useState(user ? user.name : '');
  const [searchDate, setSearchDate] = useState('');
  //   const [selectedItems, setSelectedItems] = useState([]);
  const resetFilters = () => {
    setSearchQuery('');
    setSearchDate('');
  };

  const location = useLocation();
  const { userId } = location.state || {};


  useEffect(() => {
    if (user && user.name) {
      setSearchQuery(user.name);
    }
  }, [user]);

  // Загрузка списка отелей
  const fetchHotel = () => {
    fetch(`${server}/api/getHotels`)
      .then((response) => response.json())
      .then((data) => setHotel(data))
      .catch((error) => console.error('Ошибка при загрузке отелей:', error));
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

  const filteredHotels = bronHotels.filter((item) => {
    // 1) Если передан userId – ограничиваем поиск по пользователю:
    let matchesUserId = true;
    if (userId) {
      // Здесь сравниваем, например, если в брони хранится ID клиента в поле client._id:
      matchesUserId = String(item.client?._id) === String(userId);
    }
  
    // 2) Приводим поисковый запрос к нижнему регистру
    const query = searchQuery.toLowerCase().trim();
  
    // 3) Собираем все поля, по которым хотим осуществлять поиск.
    // Можно добавить любые поля: название отеля, ФИО, телефон, номер, количество гостей, цену, даты и статус.
    const combinedFields = [
      item.name,                               // название отеля
      item.client?.name,                       // ФИО клиента
      item.client?.phone,                      // телефон клиента
      item.roomNumber,                         // номер (если есть)
      String(item.guests),                     // количество гостей
      String(item.fullPrice),                  // полная цена
      formatDate(item.createdAt),              // дата бронирования
      formatDate(item.arrivalDate),            // дата заезда
      formatDate(item.departureDate),          // дата выезда
      item.status                              // статус брони
    ]
      .filter((field) => field !== undefined && field !== null)
      .join(' ')
      .toLowerCase();
  
    // Если поисковая строка пуста, всегда возвращаем true.
    const matchesSearch = query === '' || combinedFields.includes(query);
  
    // 4) Если отдельно нужен фильтр по дате (например, по дате создания записи), можно оставить дополнительную проверку:
    const matchesDate = searchDate
      ? formatDate(item.createdAt) === formatDate(searchDate)
      : true;
  
    return matchesUserId && matchesSearch && matchesDate;
  });
  

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === 'Обработано' ? 'В ожидании' : 'Обработано';

    try {
      const response = await fetch(
        `${server}/api/updateHotelBronStatus/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchBronHotels(); // обновить список после изменения
      } else {
        console.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const handleDeleteOne = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту бронь?')) {
      try {
        await fetch(`${server}/api/deleteHotelBron/${id}`, {
          method: 'DELETE',
        });
        fetchBronHotels();
      } catch (error) {
        console.error(`Ошибка при удалении брони ${id}`, error);
      }
    }
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>
          Брони Отелей / Апартаментов
        </div>
      </div>

      <div className={classes.gids}>
        <div className={classes.gids_menu}>
          <div className={classes.gids_menu_left}>
            <button
              className={classes.multidayTours_top__add}
              onClick={openModal}
            >
              Забронировать отель
            </button>
            <input
              type="text"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button onClick={resetFilters} className={classes.resetButton}>
              Сбросить фильтры
            </button>
          </div>
        </div>

        {filteredHotels.length > 0 ? (
          <div className={classes.tableWrapper}>
            <table className={classes.hotelsTable}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Дата брони</th>
                  <th>Название отеля</th>
                  <th>ФИО</th>
                  <th>Телефон</th>
                  <th>Номер</th>
                  <th>Гости</th>
                  <th>Полная цена</th>
                  <th>Дата заезда - выезда</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((item, index) => (
                  <tr
                    key={item._id}
                    style={{
                      opacity: item.status === 'Обработано' ? 0.5 : 1, // Прозрачность для обработанных
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>{item.name}</td>
                    <td>{item.client?.name || '-'}</td>
                    <td>{item.client?.phone || '-'}</td>
                    <td>{item.roomNumber || '-'}</td>
                    <td>{item.guests}</td>
                    <td>{Number(item.fullPrice).toLocaleString('ru-RU')}</td>
                    <td>
                      {formatDate(item.arrivalDate)} –{' '}
                      {formatDate(item.departureDate)}
                    </td>
                    <td>{item.status || 'В ожидании'}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() =>
                          handleToggleStatus(item._id, item.status)
                        }
                        className={classes.statusButton}
                      >
                        {item.status === 'Обработано'
                          ? 'Вернуть'
                          : 'Обработать'}
                      </button>

                      <button
                        onClick={() => handleDeleteOne(item._id)}
                        className={classes.deleteButton}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <CalendarAdmin
          closeModal={closeModal}
          hotels={hotel.hotels}
          fetchBronHotels={fetchBronHotels}
        />
        <button onClick={closeModal} className={classes.modalCloseButton}>
          &#x2715;
        </button>
      </ReactModal>
    </div>
  );
}

export default AddHotelAndApartments;
