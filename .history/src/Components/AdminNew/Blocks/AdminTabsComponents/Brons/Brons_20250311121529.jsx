import React, { useEffect, useState } from 'react';
import classes from './Brons.module.css';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import server from '../../../../../serverConfig';
import { Calculate } from '@mui/icons-material';

function Brons({ children, ...props }) {
  const location = useLocation();
  const receivedData = location.state;

  const { add } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const [touragents, setTouragents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(receivedData?.name || '');
  const [paymentType, setPaymentType] = useState(
    receivedData?.paymentType || ''
  );
  const [paymentState, setPaymentState] = useState(
    receivedData?.paymentState || ''
  );

  const [bronTypeRole, setBronTypeRole] = useState(
    receivedData?.bronTypeRole || ''
  );
  const [dateQuery, setDateQuery] = useState('');

  async function fetchTouragents() {
    try {
      const response = await fetch(`${server}/api/getAgents`);
      const data = await response.json();
      setTouragents(data.agent.reverse());
      setFilteredAgents(data.agent);
    } catch (error) {
      console.error('Error fetching mission info:', error);
    }
  }

  useEffect(() => {
    fetchTouragents();
  }, []);

  const getUserInfo = async () => {
    const response = await fetch(`${server}/api/getUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUsers(userData.users);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : '-';
  };

  // Функция для фильтрации данных
  const applyFilters = () => {
    let filtered = touragents.filter((agent) => {
      const tourTitles = agent.tours
        .map((tour) => tour.tourTitle.toLowerCase())
        .join(', ');
      const passangerTitles = agent.passengers
        .map((passenger) => passenger.name.toLowerCase())
        .join(', ');
      const agentName = getUserNameById(agent.agent).toLowerCase();
      const price = Number(agent.price);
      const textMatch = searchQuery.toLowerCase();

      const matchesTourTitleOrAgent =
        tourTitles.includes(textMatch) ||
        agentName.includes(textMatch) ||
        passangerTitles.includes(textMatch) ||
        String(price).includes(textMatch);

      const matchesPaymentState =
        paymentState === '' || agent.confirm === (paymentState === 'true');
      const matchesPaymentType =
        paymentType === '' || agent.paymentType === paymentType;
      const matchesBronTypeRole =
        bronTypeRole === '' || agent.bronTypeRole === bronTypeRole;

      // Приведение дат к одному формату для сравнения
      const agentBookingDate = new Date(agent.createdAt)
        .toISOString()
        .split('T')[0];
      const matchesDateQuery =
        dateQuery === '' || agentBookingDate === dateQuery;

      return (
        matchesTourTitleOrAgent &&
        matchesPaymentType &&
        matchesPaymentState &&
        matchesBronTypeRole &&
        matchesDateQuery
      );
    });

    setFilteredAgents(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [
    searchQuery,
    paymentType,
    paymentState,
    bronTypeRole,
    dateQuery,
    touragents,
    users,
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handlePaymentStateChange = (e) => {
    setPaymentState(e.target.value);
  };

  const handleBronTypeRoleChange = (e) => {
    setBronTypeRole(e.target.value);
  };

  const handleDateQueryChange = (e) => {
    setDateQuery(e.target.value);
  };

  async function updateConfirm(id, price, agentID, requestFromSite) {
    const user = users.find((user) => user._id === agentID);

    let debtUser;

    if (requestFromSite == 'cash') {
      debtUser = user.debt - price;
    }

    try {
      // Обновление статуса подтверждения на сервере
      const confirmResponse = await fetch(
        `${server}/api/updateOneAgent/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            confirm: true,
          }),
        }
      );

      if (confirmResponse.ok) {
        fetchTouragents();
      }

      if (requestFromSite == 'cash') {
        if (confirmResponse.ok) {
          // Обновление долга пользователя на сервере
          const debtResponse = await fetch(`${server}/api/userUpdateDebt`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              debt: debtUser,
              idUser: agentID,
            }),
          });

          if (debtResponse.ok) {
            // Обновление состояния filteredAgents после успешного ответа сервера
            setFilteredAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent._id === id ? { ...agent, confirm: true } : agent
              )
            );
            setTouragents((prevAgents) =>
              prevAgents.map((agent) =>
                agent._id === id ? { ...agent, confirm: true } : agent
              )
            );

            fetchTouragents();
          } else {
            console.error('Error updating user debt');
          }
        } else {
          console.error('Error updating agent confirmation');
        }
      }
    } catch (error) {
      console.error('Error updating confirmation and debt:', error);
    }
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  return (
    <>
      {!add ? (
        <div className={classes.multidayTours}>
          {/* <div className={classes.multidayTours_back}>
                        <button onClick={goBack} className={classes.backButton}>
                            <img src="/back.webp" alt="" /> Вернуться назад
                        </button>
                    </div> */}

          <div className={classes.multidayTours_top}>
            <div className={classes.multidayTours_top__title}>Брони туров</div>
          </div>

          <div className={classes.filters}>
            {/* <div className={classes.searchBlock}>
                            <input
                                type="text"
                                placeholder="Поиск по названию тура, представителю или пассажиру"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={classes.filterInput}
                            />
                        </div> */}

            <div className={classes.filterBlock}>
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={handleSearchChange}
                className={classes.filterInput}
              />
              <select
                name="bronTypeRole"
                value={bronTypeRole}
                onChange={handleBronTypeRoleChange}
                className={classes.filterSelect}
              >
                <option value="">Все бронирования</option>
                <option value="Заявка с сайта">Заявка с сайта</option>
                <option value="agent">Бронирования представителя</option>
                <option value="user">Бронирования пользователя</option>
              </select>
              <input
                type="date"
                value={dateQuery}
                onChange={handleDateQueryChange}
                className={classes.filterInput}
              />
              <select
                name="paymentType"
                value={paymentType}
                onChange={handlePaymentTypeChange}
                className={classes.filterSelect}
              >
                <option value="">Все способы оплаты</option>
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
              </select>
              <select
                name="paymentState"
                value={paymentState}
                onChange={handlePaymentStateChange}
                className={classes.filterSelect}
              >
                <option value="">Все состояния</option>
                <option value={'true'}>Подтверждено</option>
                <option value={'false'}>Не подтверждено</option>
              </select>
            </div>
          </div>

          <div className={classes.gids}>
            <div className={classes.gidsButtons}></div>
            <ul className={classes.listBron}>
                <div className={classes.listBronTop}>
              <li>
                <div className={classes.listBronItem}>
                  <b>Дата брони</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Название тура</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Пассажиры</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Представитель</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Полная цена</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Способ оплаты</b>
                </div>
                <div className={classes.listBronItem}>
                  <b>Состояние</b>
                </div>
              </li>
              </div>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <li
                    key={index}
                    className={
                      agent.paymentType === 'cash' && agent.confirm == false
                        ? classes.statusConfirmCash
                        : agent.paymentType === 'Заявка с сайта' &&
                          agent.confirm == false
                        ? classes.statusConfirmRequest
                        : agent.confirm == true && classes.statusConfirmDone
                    }
                  >
                    <div className={classes.listBronItem}>
                      {formatDate(agent.createdAt)}
                    </div>
                    <div className={classes.listBronItem}>
                      {agent.tours.map((tour) => tour.tourTitle).join(', ')}
                    </div>
                    <div className={classes.listBronItem}>
                      {agent.passengers.map((tour) => tour.name).join(', ')}
                    </div>
                    <div className={classes.listBronItem}>
                      {getUserNameById(agent.agent)}
                    </div>
                    <div className={classes.listBronItem}>
                      {Number(agent.price).toLocaleString('ru-RU')} ₽{' '}
                    </div>
                    <div className={classes.listBronItem}>
                      {agent.paymentType === 'cash'
                        ? 'Наличные'
                        : agent.paymentType === 'Заявка с сайта'
                        ? '-'
                        : 'Карта'}
                    </div>
                    <div className={classes.listBronItem}>
                      {(agent.paymentType === 'cash' ||
                        agent.paymentType === 'Заявка с сайта') &&
                      agent.confirm === false ? (
                        <button
                          onClick={() =>
                            updateConfirm(
                              agent._id,
                              agent.price,
                              agent.agent,
                              agent.paymentType
                            )
                          }
                        >
                          {agent.paymentType === 'cash'
                            ? 'Подтвердить получение'
                            : 'Подтвердить заявку с сайта'}
                        </button>
                      ) : (
                        <span className={classes.confirmedStatus}>
                          Подтверждено
                          {/* <img src="main_6_logo.webp" alt="" /> */}
                        </span>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li>Нет данных, соответствующих фильтру</li>
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Brons;
