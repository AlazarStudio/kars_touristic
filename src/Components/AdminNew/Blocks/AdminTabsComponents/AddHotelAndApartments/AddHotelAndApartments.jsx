import React, { useEffect, useState } from 'react';
import classes from './AddHotelAndApartments.module.css';
import server from '../../../../../serverConfig';
import ReactModal from 'react-modal';
import CalendarAdmin from '../../../../Blocks/CalendarAdmin/CalendarAdmin';

// Устанавливаем корневой элемент для модального окна
ReactModal.setAppElement('#root');

function AddHotelAndApartments({ setActiveTab }) {
  const [bronHotels, setBronHotels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotel, setHotel] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  //   const [selectedItems, setSelectedItems] = useState([]);
  const resetFilters = () => {
    setSearchQuery('');
    setSearchDate('');
  };

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

  // Фильтрация списка по названию отеля
  const filteredHotels = bronHotels.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (searchDate
        ? formatDate(item.createdAt) === formatDate(searchDate)
        : true)
  );

  // Обработчик выбора всех записей
  //   const handleSelectAll = () => {
  //     if (selectedItems.length === filteredHotels.length) {
  //       setSelectedItems([]); // Если уже выбраны все, снимаем выделение
  //     } else {
  //       setSelectedItems(filteredHotels.map((item) => item._id)); // Выбираем все
  //     }
  //   };

  // Обработчик выбора конкретной записи
  //   const handleSelectItem = (id) => {
  //     setSelectedItems((prev) =>
  //       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //     );
  //   };

  // Удаление выбранных бронирований
  //   const handleDeleteSelected = async () => {
  //     if (selectedItems.length === 0)
  //       return alert('Выберите записи для удаления!');

  //     if (
  //       window.confirm('Вы уверены, что хотите удалить выбранные бронирования?')
  //     ) {
  //       for (const id of selectedItems) {
  //         try {
  //           await fetch(`${server}/api/deleteHotelBron/${id}`, {
  //             method: 'DELETE',
  //           });
  //         } catch (error) {
  //           console.error(`Ошибка при удалении брони ${id}`, error);
  //         }
  //       }
  //       fetchBronHotels();
  //       setSelectedItems([]);
  //     }
  //   };

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
      <button className={classes.multidayTours_top__add} onClick={openModal}>
        Забронировать отель
      </button>
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
            <th>Гости</th>
            <th>Полная цена</th>
            <th>Дата заезда - выезда</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {filteredHotels.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{item.name}</td>
              <td>{item.guests}</td>
              <td>{Number(item.fullPrice).toLocaleString('ru-RU')}</td>
              <td>
                {formatDate(item.arrivalDate)} – {formatDate(item.departureDate)}
              </td>
              <td>
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
