import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import classes from './NumberShow.module.css';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import H2 from '../../Standart/H2/H2';
import server from '../../../serverConfig';
import Add_Feedback from '../Add_Feedback/Add_Feedback';
import Feedback from '../Feedback/Feedback';

function NumberShow({ user }) {
  const [room, setRoom] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { idRoom } = useParams();
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    fetch(`${server}/api/getOneRoom/${idRoom}`)
      .then((response) => response.json())
      .then((data) => setRoom(data))
      .catch((error) => console.error('Ошибка при загрузке номера:', error));
  }, [idRoom]);

  useEffect(() => {
    if (user && room) {
      setIsFavorite(user.likes?.includes(room._id));
    }
  }, [user, room]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');

    if (!token || !localUser) {
      alert('Пожалуйста, войдите в систему, чтобы добавить в избранное.');
      navigate('/signIn');
      return;
    }

    try {
      const updates = {
        likes: [room._id],
      };

      const res = await fetch(`${server}/api/userUpdate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setIsFavorite(!isFavorite);
        setLocalUser(data.user); // обновляем user локально
      } else {
        console.error('Ошибка при обновлении избранного:', data.message);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  useEffect(() => {
    if (localUser && room) {
      setIsFavorite(localUser.likes?.includes(room._id));
    }
  }, [localUser, room]);

  if (!room) return null;

  return (
    <CenterBlock>
      <WidthBlock>
        <div className={classes.room}>
          <div className={classes.numberInfo}>
            <div className={classes.roomTitle}>
              <div className={classes.roomTitle_title}>{room.title}</div>
              <div className={classes.roomInfoData}>
                <div className={classes.roomInfoData_rating}>
                  4.5 <img src="/starYellow.png" alt="" />
                </div>
                {/* <div className={classes.roomInfoData_feedback}>10 отзывов</div> */}
                <div className={classes.roomInfoData_adress}>{room.adress}</div>
                <div className={classes.roomInfoData_button}>
                  <a
                    href={room.adressLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Показать на карте
                  </a>
                </div>
              </div>
            </div>

            <div className={classes.numberInfo_left}>
              <div
                className={`${classes.numberInfo_left__slider} numberSlider`}
              >
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  loop={false}
                  className="mySwiper"
                >
                  {room.photos.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={`${server}/refs/${img}`} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className={classes.numberInfo_bron}>
                <div className={classes.room__like} onClick={toggleFavorite}>
                  <img
                    src={
                      isFavorite ? '/userLike_full.png' : '/userLike_empty.png'
                    }
                    alt="like"
                  />
                  <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
                </div>

                <div className={classes.numberInfo_bron_calendar}>
                  Календарь
                </div>
                <div className={classes.numberInfo_bron_service}>
                  <span>Служба бронирования:</span>
                  <a href="tel:+70000000000">+7 (000) 000-00-00</a>
                </div>
              </div>
            </div>

            <div className={classes.numberInfo_right}>
              <div className={classes.numberInfo_right__title}>
                {room.title}
              </div>
              <div className={classes.numberInfo_right__desc}>
                {room.description}
              </div>

              <div className={classes.numberInfo_left__desc}>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Площадь</p>
                  <p>{room.square} м2</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Кровать</p>
                  <p>{room.bed}</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Дополнительно</p>
                  <p>{room.additionally}</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Уборка</p>
                  <p>{room.cleaning}</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Смена белья</p>
                  <p>{room.changeOfLinen}</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Питание</p>
                  <p>{room.food}</p>
                </div>
                <div className={classes.numberInfo_left__desc___item}>
                  <p>Вид</p>
                  <p>{room.type}</p>
                </div>
              </div>

              <div className={classes.numberInfo_right__desc___items}>
                <div
                  className={classes.numberInfo_right__desc___items____block}
                >
                  <div
                    className={
                      classes.numberInfo_right__desc___items____block_____title
                    }
                  >
                    В номере:
                  </div>
                  <div
                    className={
                      classes.numberInfo_right__desc___items____block____elements
                    }
                  >
                    {room.inRoom.map((item, index) => (
                      <div key={index}>
                        <p>
                          <img src="/yes.webp" alt="" />
                        </p>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={classes.numberInfo_right__desc___items____block}
                >
                  <div
                    className={
                      classes.numberInfo_right__desc___items____block_____title
                    }
                  >
                    Принадлежности:
                  </div>
                  <div
                    className={
                      classes.numberInfo_right__desc___items____block____elements
                    }
                  >
                    {room.accessories.map((item, index) => (
                      <div key={index}>
                        <p>
                          <img src="/yes.webp" alt="" />
                        </p>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ОТЗЫВЫ */}
          <CenterBlock>
            <H2 text_transform="uppercase" font_size="36px">
              ОТЗЫВЫ
            </H2>
          </CenterBlock>

          {user && <Add_Feedback userID={user._id} roomID={idRoom} />}
          <Feedback roomID={idRoom} />
        </div>
      </WidthBlock>
    </CenterBlock>
  );
}

export default NumberShow;
