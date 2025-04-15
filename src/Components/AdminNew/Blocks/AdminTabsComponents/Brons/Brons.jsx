import React, { useEffect, useState } from 'react';
import classes from './Brons.module.css';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import server from '../../../../../serverConfig';
import { Calculate } from '@mui/icons-material';

function Brons({ fetchBronsData, user }) {
  const location = useLocation();
  const receivedData = location.state;

  const { userId, name } = location.state || {};

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
  const [selectedAgents, setSelectedAgents] = useState([]);

  const [userIdFromState, setUserIdFromState] = useState(userId);
  const [nameFromState, setNameFromState] = useState(name);
  const [filtersReset, setFiltersReset] = useState(false);

  const fetchTouragents = async () => {
    try {
      const response = await fetch(`${server}/api/getAgents`);
      const data = await response.json();
      setTouragents(data.agent.reverse());
      setFilteredAgents(data.agent);

      // Обновляем количество броней в админке
      if (fetchBronsData) {
        fetchBronsData();
      }
    } catch (error) {
      console.error('Ошибка загрузки агентов:', error);
    }
  };

  useEffect(() => {
    fetchTouragents();
  }, []);

  const getUserInfo = async () => {
    const response = await fetch(`${server}/api/getUsers`);
    if (response.ok) {
      const userData = await response.json();
      setUsers(userData.users);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // Функция удаления выбранных бронирований
  const handleDeleteSelected = async () => {
    if (selectedAgents.length === 0) {
      alert('Выберите хотя бы одно бронирование!');
      return;
    }
    await fetchTouragents();
    if (fetchBronsData) fetchBronsData();

    if (
      window.confirm('Вы уверены, что хотите удалить выбранные бронирования?')
    ) {
      for (const id of selectedAgents) {
        try {
          await fetch(`${server}/api/deleteAgent/${id}`, { method: 'DELETE' });
        } catch (error) {
          console.error(`Ошибка удаления бронирования ${id}:`, error);
        }
      }
      fetchTouragents();
      setSelectedAgents([]);
    }
  };

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

  useEffect(() => {
    fetchTouragents();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserNameById = (agentField) => {
    if (!agentField) return '-';
    const id = typeof agentField === 'object' ? agentField._id : agentField;
    const found = users.find((u) => u._id === id);
    return found ? found.name : `ID: ${id}`;
  };

  const getUserPhoneById = (agentField) => {
    if (!agentField) return '-';
    const id = typeof agentField === 'object' ? agentField._id : agentField;
    const found = users.find((u) => u._id === id);
    return found ? found.phone : 'не найден';
  };

  // Функция для фильтрации данных
  const applyFilters = () => {
    let filtered = touragents;

    // if (userId) {
    //   filtered = filtered.filter((agent) => {
    //     return String(agent.agent) === String(userId);
    //   });
    // }

    if (userIdFromState) {
      filtered = filtered.filter((agent) => {
        return String(agent.agent) === String(userIdFromState);
      });
    }

    if (user) {
      filtered = filtered.filter((agent) => {
        const agentId =
          typeof agent.agent === 'object' ? agent.agent._id : agent.agent;
        return String(agentId) === String(user._id);
      });
    }

    filtered = filtered.filter((agent) => {
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
    userIdFromState,
    nameFromState,
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

  async function updateConfirm(id, price, agentID, paymentType, currentStatus) {
    const user = users.find((user) => user._id === agentID);
    let debtUser = user?.debt;

    if (paymentType === 'cash' && currentStatus === false) {
      debtUser = user.debt - price;
    }

    try {
      const confirmResponse = await fetch(
        `${server}/api/updateOneAgent/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirm: !currentStatus }),
        }
      );

      if (confirmResponse.ok) {
        if (paymentType === 'cash') {
          const debtResponse = await fetch(`${server}/api/userUpdateDebt`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ debt: debtUser, idUser: agentID }),
          });

          if (!debtResponse.ok) {
            console.error('Ошибка обновления долга');
          }
        }

        fetchTouragents();
        if (fetchBronsData) fetchBronsData();
      }
    } catch (error) {
      console.error('Ошибка при изменении подтверждения:', error);
    }
  }

  async function updateStatus(id, currentStatus) {
    try {
      const response = await fetch(`${server}/api/updateOneAgent/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentStatus }),
      });

      if (response.ok) {
        fetchTouragents(); // обновим список
        if (fetchBronsData) fetchBronsData();
      } else {
        console.error('Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const handleDeleteOne = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это бронирование?')) {
      try {
        await fetch(`${server}/api/deleteAgent/${id}`, {
          method: 'DELETE',
        });
        fetchTouragents(); // обновим список
      } catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    }
  };

  useEffect(() => {
    if (filtersReset) {
      applyFilters();
      setFiltersReset(false); // сбрасываем обратно
    }
  }, [filtersReset]);

  // Сброс Фильтров

  const resetFilters = () => {
    setSearchQuery('');
    setPaymentType('');
    setPaymentState('');
    setBronTypeRole('');
    setDateQuery('');
    setUserIdFromState(null);
    
    setFiltersReset(true);
  
    // Сначала сбрасываем URL
    navigate('/admin/brons', { replace: true });
  
    
    // А затем принудительно обновляем страницу
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };
  

  useEffect(() => {
    if (receivedData?.name && !filtersReset) {
      setSearchQuery(receivedData.name);
    }
    if (receivedData?.userId && !filtersReset) {
      setUserIdFromState(receivedData.userId);
    }
  }, [receivedData, filtersReset]);

  // Сброс Фильтров

  const [selectedBron, setSelectedBron] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

            <div className={classes.gids}>
              {/* <div className={classes.gidsButtons}>
              <button onClick={handleDeleteSelected}>Удалить</button>
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
                  <option value="">Тип брони</option>
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
                <button onClick={resetFilters} className={classes.resetButton}>
                  Сбросить фильтры
                </button>
              </div>

              <div className={classes.tableWrapper}>
                <table className={classes.bronTable}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Дата брони</th>
                      <th>Название тура</th>
                      <th>Полная цена</th>
                      <th>Оплата</th>

                      <th>Имя клиента</th>
                      <th>Телефон</th>
                      <th>Статус</th>
                      <th>Оплата</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.length > 0 ? (
                      filteredAgents.map((agent, index) => (
                        <tr
                          key={agent._id}
                          className={
                            agent.status
                              ? classes.statusConfirmDone
                              : classes.statusConfirmCash
                          }
                        >
                          <td>{index + 1}</td>
                          <td>{formatDate(agent.createdAt)}</td>
                          <td>
                            {agent.tours
                              .map((tour) => tour.tourTitle)
                              .join(', ')}
                          </td>
                          <td>{Number(agent.price).toLocaleString('ru-RU')}</td>
                          <td>
                            {agent.paymentType === 'cash'
                              ? 'Наличные'
                              : agent.paymentType === 'Заявка с сайта'
                              ? '-'
                              : 'Карта'}
                          </td>

                          <td>{getUserNameById(agent.agent)}</td>
                          <td>{getUserPhoneById(agent.agent)}</td>
                          <td>
                            {agent.status ? (
                              <span className={classes.confirmedStatus}>
                                Подтверждено
                              </span>
                            ) : (
                              <span className={classes.unconfirmedStatus}>
                                Не подтверждено
                              </span>
                            )}
                          </td>

                          <td>
                            {agent.confirm ? (
                              <span className={classes.confirmedStatus}>
                                Оплачено
                              </span>
                            ) : (
                              <span className={classes.unconfirmedStatus}>
                                Не оплачено
                              </span>
                            )}
                          </td>
                          <td className={classes.serviceButton}>
                            <button
                              onClick={() =>
                                updateStatus(agent._id, agent.status)
                              }
                              className={
                                agent.status
                                  ? `${classes.confirmButton} ${classes.cancelButton}`
                                  : classes.confirmButton
                              }
                            >
                              {agent.status ? 'Отменить' : 'Обработать'}
                            </button>

                            <button
                              onClick={() =>
                                updateConfirm(
                                  agent._id,
                                  agent.price,
                                  agent.agent,
                                  agent.paymentType,
                                  agent.confirm
                                )
                              }
                              className={
                                agent.confirm
                                  ? `${classes.confirmButton} ${classes.cancelButton}`
                                  : classes.confirmButton
                              }
                            >
                              {agent.confirm ? 'Не оплачено' : 'Оплачено'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBron(agent);
                                setIsModalOpen(true);
                              }}
                              className={classes.viewButton}
                            >
                              Просмотр
                            </button>

                            <button
                              onClick={() => handleDeleteOne(agent._id)}
                              className={classes.deleteButton}
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center' }}>
                          Нет данных, соответствующих фильтру
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {isModalOpen && selectedBron && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <div className={classes.modalHeader}>
              <h2>Информация о бронировании</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={classes.modalClose}
              >
                ✕
              </button>
            </div>

            <div className={classes.modalSection}>
              <h3>Основные данные</h3>
              <p>
                <b>Оплта:</b>{' '}
                {selectedBron.confirm ? '✅ Оплачено' : '❌ Не оплачено'}
              </p>
              <p>
                <b>Статус:</b>{' '}
                {selectedBron.status ? '✅ Подтверждено' : '❌ Не подтверждено'}
              </p>
              <p>
                <b>Тип брони:</b> {selectedBron.bronTypeRole}
              </p>
              <p>
                <b>Тип оплаты:</b> {selectedBron.paymentType}
              </p>
              <p>
                <b>Сумма:</b>{' '}
                {Number(selectedBron.price).toLocaleString('ru-RU')} ₽
              </p>
              <p>
                <b>Дата отправления:</b> {selectedBron.bookingDate}
              </p>
              <p>
                <b>Время отправления:</b> {selectedBron.bookingTime}
              </p>
            </div>

            <div className={classes.modalSection}>
              <h3>Информация о турах</h3>
              {selectedBron.tours?.map((tour, index) => (
                <div key={index} className={classes.modalSubBlock}>
                  <p>
                    <b>Название:</b> {tour.tourTitle}
                  </p>
                  <p>
                    <b>Метод:</b> {tour.travelMethod}
                  </p>
                  <p>
                    <b>Тип:</b> {tour.tourType}
                  </p>
                  <p>
                    <b>Сложность:</b> {tour.difficulty}
                  </p>
                  <p>
                    <b>Продолжительность:</b> {tour.duration}
                  </p>
                </div>
              ))}
            </div>

            <div className={classes.modalSection}>
              <h3>Пассажиры</h3>
              {selectedBron.passengers?.map((passenger, i) => (
                <div key={i} className={classes.modalSubBlock}>
                  <p>
                    <b>ФИО:</b> {passenger.name}
                  </p>
                  <p>
                    <b>Почта:</b> {passenger.email}
                  </p>
                  <p>
                    <b>Телефон:</b> {passenger.phone}
                  </p>
                  <p>
                    <b>Адрес:</b> {passenger.address}
                  </p>
                  <p>
                    <b>Паспорт:</b> {passenger.passportSeries}{' '}
                    {passenger.passportNumber}
                  </p>
                  <p>
                    <b>Пол:</b>{' '}
                    {passenger.gender === 'male' ? 'Мужской' : 'Женский'}
                  </p>
                  <p>
                    <b>Дата рождения:</b> {passenger.birthDate}
                  </p>
                </div>
              ))}
            </div>

            <div className={classes.modalFooter}>
              <button
                className={classes.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Brons;
