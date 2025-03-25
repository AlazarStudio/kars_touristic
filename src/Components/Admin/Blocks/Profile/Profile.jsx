import React, { useState, useEffect } from 'react';
import classes from './Profile.module.css';
import Header_black from '../../../Blocks/Header_black/Header_black';
import CenterBlock from '../../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../../Standart/WidthBlock/WidthBlock';
import H2 from '../../../Standart/H2/H2';

import server from '../../../../serverConfig';
import { Link, useNavigate } from 'react-router-dom';
import Favorites_Page from '../../../Pages/Favorites_Page/Favorites_Page';

function Profile({ children, ...props }) {
  const [user, setUser] = useState(null);
  const [agents, setAgents] = useState([]);
  const [hotelBrons, setHotelBrons] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const checkTokenValidity = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Время истечения в миллисекундах
    return Date.now() < expirationTime;
  };

  const getHoursUntilExpiration = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeDifference = expirationTime - currentTime;
    const hoursUntilExpiration = timeDifference / (1000 * 60 * 60);

    return hoursUntilExpiration;
  };

  const clearLocalStorageAtMidnight = () => {
    const now = new Date();

    const nextMidnight = new Date();
    nextMidnight.setHours(0, 0, 0, 0);

    if (now > nextMidnight) {
      nextMidnight.setDate(nextMidnight.getDate() + 1);
    }

    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
      localStorage.clear();
      console.log('Local Storage очищен в 00:00.');

      setInterval(() => {
        localStorage.clear();
        console.log('Local Storage очищен в 00:00.');
      }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  };

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(`${server}/api/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        navigate('/signIn');
      }
    } catch (error) {
      console.error('Ошибка получения информации о пользователе', error);
      // localStorage.removeItem('token');
      navigate('/signIn');
    } finally {
      setLoading(false);
    }
  };

  const getAgentsInfo = async () => {
    try {
      const response = await fetch(`${server}/api/getAgents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const agentsData = await response.json();
        setAgents(agentsData.agent.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHotelBronsInfo = async () => {
    try {
      const response = await fetch(`${server}/api/getHotelBrons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const hotelBronsData = await response.json();
        setHotelBrons(hotelBronsData.hotelBron.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  clearLocalStorageAtMidnight();

  // const hours = getHoursUntilExpiration(localStorage.getItem('token'));
  // console.log(`Токен истечет через ${Math.floor(hours)} часов.`);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && checkTokenValidity(token)) {
      getUserInfo(token);
      getAgentsInfo(); // Получаем список агентов после проверки токена
      getHotelBronsInfo(); // Получаем список броней отлей после проверки токена
    } else {
      // localStorage.removeItem('token');
      navigate('/signIn');
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/signIn');
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const filteredAgents = agents.filter(
    (agent) =>
      agent.agent === user._id ||
      agent.passengers.some((passenger) => passenger.name == user.name)
  );

  const filteredHotelBrons = hotelBrons.filter(
    (hotelBron) => hotelBron.userID === user._id
  );

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

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

  console.log(filteredAgents);
  return (
    <>
      <Header_black />
      {user ? (
        <CenterBlock>
          <WidthBlock>
            <div className={classes.blockUser}>
              <div className={classes.logout}>
                {user.role === 'admin' ? (
                  <Link to={'/admin'}>
                    <img
                      src="/admin-panel 1.webp"
                      alt="Перейти в Панель Администратора"
                    />
                    Перейти в Панель Администратора
                  </Link>
                ) : user.role === 'touragent' && user.adminPanelAccess ? (
                  <Link to={'/admin'}>
                    <img
                      src="/admin-panel 1.webp"
                      alt="Перейти в Панель Автора туров"
                    />
                    Перейти в Панель Автора туров
                  </Link>
                ) : user.role === 'user' || user.role === 'agent' ? null : (
                  'Ожидается подтверждение аккаунта администратором'
                )}
                <img src="/logout.png" alt="Выйти" onClick={logout} />
              </div>

              <div className={classes.blockUser_img}>
                <img src="/noPhoto.png" alt="Фото профиля" />
              </div>
              <div className={classes.blockUser_info}>
                {user.name}
                <div className={classes.blockUser_info_desc}>
                  <div>
                    <b>Телефон:</b> {user.phone}
                  </div>
                  <div>
                    <b>Почта:</b> {user.email}
                  </div>
                </div>
              </div>
            </div>
            <Favorites_Page />
            {/* <div className={classes.blockUser}>
                            <div className={classes.contacts}>
                                <H2 text_transform={'uppercase'}>Контакты</H2>

                                <div className={classes.contacts_elem}>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/phone.png" alt="Телефон" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.phone}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Телефон</div>
                                        </div>
                                    </div>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/email.png" alt="Почта" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.email}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Почта</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

            {user.role != 'admin' && filteredAgents.length > 0 && (
              <div className={classes.blockUser}>
                <div className={classes.contacts}>
                  <div className={classes.titleBlock}>
                    <H2 text_transform={'uppercase'}>Брони туров</H2>
                    {user.role == 'agent' && (
                      <div className={classes.titleBlockPrice}>
                        Задолженность:{' '}
                        <b>{user.debt.toLocaleString('ru-RU')}</b>
                      </div>
                    )}
                  </div>

                  <ul className={classes.listBron}>
                    <li>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Дата брони</b>
                      </div>
                      <div className={`${classes.listBronItem}`}>
                        <b>Название тура</b>
                      </div>
                      {/* {user.role == 'agent' && <div className={classes.listBronItem}><b>Участники</b></div>} */}
                      <div className={`${classes.listBronItem}`}>
                        <b>Дата тура</b>
                      </div>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Полная цена</b>
                      </div>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Тип оплаты</b>
                      </div>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Состояние</b>
                      </div>
                      <div className={`${classes.listBronItem} `}>
                        <b>Скачать</b>
                      </div>
                    </li>
                    {filteredAgents.map((agent) => (
                      <li key={agent.id}>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {formatDate(agent.createdAt)}
                        </div>
                        <div className={`${classes.listBronItem}`}>
                          {agent.tours.map((tour) => tour.tourTitle).join(', ')}
                        </div>
                        {/* {user.role == 'agent' && <div className={classes.listBronItem}>{agent.passengers.map((tour) => tour.name).join(', ')}</div>} */}
                        <div className={`${classes.listBronItem}`}>
                          {formatDateRange(agent.bookingDate)}
                        </div>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {Number(agent.price).toLocaleString('ru-RU')}
                        </div>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {agent.paymentType == 'cash' ? 'Наличными' : 'Картой'}
                        </div>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {agent.paymentType === 'cash' &&
                            agent.confirm == false
                            ? 'Не подтверждено'
                            : 'Подтверждено'}
                        </div>
                        <div className={classes.listBronItem}>
                          <a
                            href={`${server}/refs/VOUCHER для тура ${agent.tours[0].tourTitle} - ${agent.passengers[0].name}.docx`}
                          >
                            <img src="/voucher.png" alt="" />
                          </a>
                          {/* <a href={''}>
                                                        <img src="/contract.png" alt="" />
                                                    </a> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {user.role != 'admin' && filteredHotelBrons.length > 0 && (
              <div className={classes.blockUser}>
                <div className={classes.contacts}>
                  <div className={classes.titleBlock}>
                    <H2 text_transform={'uppercase'}>
                      Брони отелей / апартаментов
                    </H2>
                    {user.role == 'agent' && (
                      <div className={classes.titleBlockPrice}>
                        Задолженность:{' '}
                        <b>{user.debt.toLocaleString('ru-RU')}</b>
                      </div>
                    )}
                  </div>

                  <ul className={classes.listBron}>
                    <li>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Дата брони</b>
                      </div>
                      <div className={`${classes.listBronItem}`}>
                        <b>Название отеля</b>
                      </div>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Количество гостей</b>
                      </div>
                      <div
                        className={`${classes.listBronItem} ${classes.mobileHide}`}
                      >
                        <b>Полная цена</b>
                      </div>
                      <div className={`${classes.listBronItem}`}>
                        <b>Прибытие</b>
                      </div>
                      <div className={`${classes.listBronItem}`}>
                        <b>Выезд</b>
                      </div>
                      <div className={`${classes.listBronItem}`}>
                        <b>Скачать</b>
                      </div>
                    </li>
                    {filteredHotelBrons.map((hotelBron) => (
                      <li key={hotelBron.id}>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {formatDate(hotelBron.createdAt)}
                        </div>
                        <div className={`${classes.listBronItem}`}>
                          {hotelBron.name}
                        </div>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {hotelBron.guests}
                        </div>
                        <div
                          className={`${classes.listBronItem} ${classes.mobileHide}`}
                        >
                          {Number(hotelBron.fullPrice).toLocaleString('ru-RU')}
                        </div>
                        <div className={`${classes.listBronItem}`}>
                          {formatDate(hotelBron.arrivalDate)}
                        </div>
                        <div className={`${classes.listBronItem}`}>
                          {formatDate(hotelBron.departureDate)}
                        </div>
                        <div className={`${classes.listBronItem}`}>
                          <a
                            href={`${server}/refs/VOUCHER для отеля ${hotelBron.name} - ${hotelBron.client[0].name}.docx`}
                          >
                            <img src="/voucher.png" alt="" />
                          </a>
                          {/* <a href={''}>
                                                        <img src="/contract.png" alt="" />
                                                    </a> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(filteredAgents.length == 0 || filteredHotelBrons.length == 0) && (
              <br />
            )}
          </WidthBlock>
        </CenterBlock>
      ) : null}
    </>
  );
}

export default Profile;
