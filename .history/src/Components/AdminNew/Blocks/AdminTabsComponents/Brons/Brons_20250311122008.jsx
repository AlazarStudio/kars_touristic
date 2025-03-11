import React, { useEffect, useState } from 'react';
import classes from './Brons.module.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import server from '../../../../../serverConfig';

function Brons() {
  const location = useLocation();
  const receivedData = location.state;

  const { add } = useParams();
  const navigate = useNavigate();

  const [touragents, setTouragents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(receivedData?.name || '');
  const [selectedAgents, setSelectedAgents] = useState([]);

  const fetchTouragents = async () => {
    try {
      const response = await fetch(`${server}/api/getAgents`);
      const data = await response.json();
      setTouragents(data.agent.reverse());
      setFilteredAgents(data.agent);
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

  // Функция выбора всех бронирований
  const handleSelectAll = () => {
    if (selectedAgents.length === filteredAgents.length) {
      setSelectedAgents([]); // Если все уже выбраны, снимаем выделение
    } else {
      setSelectedAgents(filteredAgents.map(agent => agent._id)); // Выбираем все
    }
  };

  // Функция выбора одной записи
  const handleSelectItem = (id) => {
    setSelectedAgents(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Функция удаления выбранных бронирований
  const handleDeleteSelected = async () => {
    if (selectedAgents.length === 0) {
      alert("Выберите хотя бы одно бронирование!");
      return;
    }

    if (window.confirm("Вы уверены, что хотите удалить выбранные бронирования?")) {
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

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU');
  }

  return (
    <>
      {!add ? (
        <div className={classes.multidayTours}>
          <div className={classes.multidayTours_top}>
            <div className={classes.multidayTours_top__title}>Брони туров</div>
          </div>

          <div className={classes.filters}>
            <input
              type="text"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={classes.filterInput}
            />
          </div>

          <div className={classes.gids}>
            <div className={classes.gidsButtons}>
              <button onClick={handleSelectAll}>
                {selectedAgents.length === filteredAgents.length ? "Снять выделение" : "Выбрать все"}
              </button>
              <button onClick={handleDeleteSelected}>Удалить</button>
            </div>

            <ul className={classes.listBron}>
              <div className={classes.listBronTop}>
                <li>
                  <div className={classes.listBronItem}><b>Выбрать</b></div>
                  <div className={classes.listBronItem}><b>Дата брони</b></div>
                  <div className={classes.listBronItem}><b>Название тура</b></div>
                  <div className={classes.listBronItem}><b>Полная цена</b></div>
                  <div className={classes.listBronItem}><b>Оплата</b></div>
                  <div className={classes.listBronItem}><b>Состояние</b></div>
                </li>
              </div>

              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent, index) => (
                  <li key={index} className={agent.confirm ? classes.statusConfirmDone : classes.statusConfirmCash}>
                    <div className={classes.listBronItem}>
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent._id)}
                        onChange={() => handleSelectItem(agent._id)}
                      />
                    </div>
                    <div className={classes.listBronItem}>{formatDate(agent.createdAt)}</div>
                    <div className={classes.listBronItem}>{agent.tours.map(tour => tour.tourTitle).join(', ')}</div>
                    <div className={classes.listBronItem}>{Number(agent.price).toLocaleString('ru-RU')} ₽</div>
                    <div className={classes.listBronItem}>
                      {agent.paymentType === 'cash' ? 'Наличные' : agent.paymentType === 'Заявка с сайта' ? '-' : 'Карта'}
                    </div>
                    <div className={classes.listBronItem}>
                      {agent.confirm ? <span className={classes.confirmedStatus}>Подтверждено</span> :
                        <button onClick={() => updateConfirm(agent._id)}>Подтвердить</button>}
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
