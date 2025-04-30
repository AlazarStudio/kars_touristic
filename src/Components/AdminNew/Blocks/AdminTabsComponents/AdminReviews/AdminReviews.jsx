import React, { useEffect, useState } from 'react';
import server from '../../../../../serverConfig';
import classes from './AdminReviews.module.css';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

function AdminReviews({ fetchReviews: updateCount }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${server}/api/getReview`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Ошибка при получении отзывов:', err);
    }
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${server}/api/getUsers`) // ❗️Убедись, что этот эндпоинт возвращает всех пользователей
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []));
  }, []);

  const getUserName = (userID) => {
    const user = users.find((u) => u._id === userID);
    return user ? user.name : 'Неизвестно';
  };

  const toggleVisibility = async (id, current) => {
    try {
      const res = await fetch(`${server}/api/updateOneReview/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !current }),
      });
      const data = await res.json();
      if (data) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, visible: !current } : r))
        );
      }
      if (data) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, visible: !current } : r))
        );
        if (updateCount) updateCount(); // обновляем количество
      }
    } catch (err) {
      console.error('Ошибка при смене видимости:', err);
    }
  };

  const deleteReview = async (id) => {
    await fetch(`${server}/api/deleteReview/${id}`, { method: 'DELETE' });
    setReviews((prev) => prev.filter((r) => r._id !== id));
    if (updateCount) updateCount(); // обновляем количество

    if (confirm('Удалить отзыв?')) {
      try {
        await fetch(`${server}/api/deleteReview/${id}`, { method: 'DELETE' });
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } catch (err) {
        console.error('Ошибка при удалении отзыва:', err);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const [hotels, setHotels] = useState([]);
  const [onedayTours, setOnedayTours] = useState([]);
  const [multidayTours, setMultidayTours] = useState([]);
  const [authorTours, setAuthorTours] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(`${server}/api/getRooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []));
  }, []);

  useEffect(() => {
    fetchReviews();

    // Загрузка названий по объектам
    fetch(`${server}/api/getHotels`)
      .then((res) => res.json())
      .then((data) => setHotels(data.hotels || []));

    fetch(`${server}/api/getOnedayTours`)
      .then((res) => res.json())
      .then((data) => setOnedayTours(data.onedayTour || []));

    fetch(`${server}/api/getMultidayTours`)
      .then((res) => res.json())
      .then((data) => setMultidayTours(data.multidayTour || []));

    fetch(`${server}/api/getAuthorTours`)
      .then((res) => res.json())
      .then((data) => setAuthorTours(data.authorTour || []));
  }, []);

  const getPlaceName = (review) => {
    if (review.hotelID) {
      const hotel = hotels.find((h) => h._id === review.hotelID);
      return hotel ? ` Отель: ${hotel.title}` : ' Отель (не найден)';
    }

    if (review.roomID) {
      const room = rooms.find((r) => r._id === review.roomID);
      if (room) {
        const hotel = hotels.find((h) => h._id === room.hotelID);
        return hotel
          ? ` Комната / ${room.title} в отеле ${hotel.title}`
          : ` Комната / ${room.title}`;
      } else {
        return ' Комната (не найдена)';
      }
    }

    if (review.oneTourID) {
      const tour = onedayTours.find((t) => t._id === review.oneTourID);
      return tour ? ` Однодневный тур / ${tour.tourTitle}` : ' Тур (не найден)';
    }

    if (review.multiTourID) {
      const tour = multidayTours.find((t) => t._id === review.multiTourID);
      return tour
        ? ` Многодневный тур / ${tour.tourTitle}`
        : ' Тур (не найден)';
    }

    if (review.autorTourID) {
      const tour = authorTours.find((t) => t._id === review.autorTourID);
      return tour ? ` Авторский тур / ${tour.tourTitle}` : ' Тур (не найден)';
    }

    return ' Неизвестное место';
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    return a.visible === b.visible ? 0 : a.visible ? 1 : -1;
  });

  return (
    <div className={classes.reviewList}>
      <h2>Отзывы пользователей</h2>

      {reviews.length === 0 ? (
        <p>Отзывов пока нет.</p>
      ) : (
        <table className={classes.reviewTable}>
          <thead>
            <tr>
              <th>№</th>
              <th>Пользователь</th>
              <th>Отзыв</th>
              <th>Объект</th>
              <th>Дата</th>
              <th>Видимость</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedReviews.map((review, index) => (
              <tr
                key={review._id}
                className={review.visible ? classes.visibleReview : ''}
              >
                <td>{index + 1}</td> {/* номер строки */}
                <td>{getUserName(review.userID)}</td>
                <td>{review.text}</td>
                <td>{getPlaceName(review)}</td>
                <td>
                  {new Date(review.createdAt).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {review.visible ? 'Да' : 'Нет'}
                </td>
                <td>
                  <button
                  className={classes.viewButton}
                    onClick={() => toggleVisibility(review._id, review.visible)}
                    title={review.visible ? 'Скрыть' : 'Показать'}
                  >
                    {review.visible ? 'Скрыть' : 'Показать'}
                  </button>
                  <button
                    className={classes.deleteButton}
                    onClick={() => deleteReview(review._id)}
                    title="Удалить"
                    style={{ marginLeft: 4 }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminReviews;
