import React, { useEffect, useState } from 'react';
import server from '../../../../../serverConfig';
import classes from './AdminReviews.module.css';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

function AdminReviews() {
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
    } catch (err) {
      console.error('Ошибка при смене видимости:', err);
    }
  };

  const deleteReview = async (id) => {
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
      return tour ? ` Многодневный тур / ${tour.tourTitle}` : ' Тур (не найден)';
    }
  
    if (review.autorTourID) {
      const tour = authorTours.find((t) => t._id === review.autorTourID);
      return tour ? ` Авторский тур / ${tour.tourTitle}` : ' Тур (не найден)';
    }
  
    return ' Неизвестное место';
  };
  

  return (
    <div className={classes.reviewList}>
      <h2>Отзывы пользователей</h2>
      {reviews.length === 0 ? (
        <p>Отзывов пока нет.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className={classes.reviewItem}>
            <div className={classes.reviewText}>
              <strong>Отзыв :</strong> {review.text}
              <div className={classes.reviewPlace}> <strong>Для :</strong>{getPlaceName(review)}</div>
              <div className={classes.reviewDate}>
                {new Date(review.createdAt).toLocaleString()}
              </div>
            </div>

            <div className={classes.reviewActions}>
              <button
                title={review.visible ? 'Скрыть' : 'Показать'}
                onClick={() => toggleVisibility(review._id, review.visible)}
              >
                {review.visible ? (
                  <Eye color="green" size={20} />
                ) : (
                  <EyeOff color="gray" size={20} />
                )}
              </button>

              <button onClick={() => deleteReview(review._id)} title="Удалить">
                <Trash2 color="red" size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminReviews;
