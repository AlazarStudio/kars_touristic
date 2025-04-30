import React from 'react';
import classes from './HotelNumber.module.css';
import { Link, useNavigate } from 'react-router-dom';
import server from '../../../serverConfig';

function HotelNumber({
  children,
  handleOpen,
  isSimillar,
  openCalendarModal,
  hotel,
  numbers,
  user,
  setUser,
}) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLikeRoom = async (roomId) => {
    if (!token || !user) {
      alert('Пожалуйста, войдите в систему');
      navigate('/signIn');
      return;
    }
  
    try {
      const res = await fetch(`${server}/api/userUpdate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: [roomId] }), // отправляем только один ID
      });
  
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); // обновляем пользователя
      } else {
        console.error('Ошибка обновления лайков:', data.message);
      }
    } catch (err) {
      console.error('Ошибка отправки лайка:', err);
    }
  };
  

  return (
    <div className={classes.hotelNumbers}>
      {numbers.map((item, index) => (
        <div className={classes.hotelNumbers_item} key={index}>
          <Link
            to={item._id}
            className={classes.hotelNumbers_item__link}
            onClick={() => handleOpen(item._id, true)}
          >
            <div className={classes.hotelNumbers_item__img}>
              <img src={`${server}/refs/${item.mainPhoto}`} alt="" />
              {/* Иконка лайка */}
            
            </div>
            {/* <div
                className={classes.hotelNumbers_like}
                onClick={(e) => {
                  e.preventDefault();
                  handleLikeRoom(item._id);
                }}
              >
                <img
                  src={
                    user?.likes?.includes(item._id)
                      ? '/userLike_full.png'
                      : '/userLike_empty.png'
                  }
                  alt="like"
                />
                <span>
                  {user?.likes?.includes(item._id)
                    ? 'В избранном'
                    : 'В избранное'}
                </span>
              </div> */}
            <div className={classes.hotelNumbers_item__bottom}>
              <div className={classes.hotelNumbers_item__bottom___title}>
                {item.title}
              </div>
              <div className={classes.hotelNumbers_item__bottom___infoBlocks}>
                <div
                  className={
                    classes.hotelNumbers_item__bottom___infoBlocks_text
                  }
                >
                  <div
                    className={
                      classes.hotelNumbers_item__bottom___infoBlocks____block
                    }
                  >
                    {item.places} гостя
                  </div>
                  <div
                    className={
                      classes.hotelNumbers_item__bottom___infoBlocks____block
                    }
                  >
                    {item.bed} кровати
                  </div>
                  <div
                    className={
                      classes.hotelNumbers_item__bottom___infoBlocks____block
                    }
                  >
                    {item.square} м²
                  </div>
                </div>
                <div className={classes.hotelNumbers_item__bottom___infoBlocks}>
                  <div
                    className={
                      classes.hotelNumbers_item__bottom___infoBlocks____price
                    }
                  >
                    {Number(item.price).toLocaleString('ru-RU')} ₽
                    <span>за сутки</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <button
            className={classes.bronBtn}
            onClick={() => openCalendarModal(item)}
          >
            Оставить заявку
          </button>
        </div>
      ))}
    </div>
  );
}

export default HotelNumber;
