import React, { useEffect, useState } from 'react';
import classes from './AddUsers.module.css';
import server from '../../../../../serverConfig';
import { useNavigate } from 'react-router-dom';
import Feedback from '../../../../Blocks/Feedback/Feedback';

function Modal({ isActive, onClose, children }) {
  if (!isActive) return null;

  return (
    <div
      className={`${classes.modal} ${isActive ? classes.active : ''}`}
      onClick={onClose}
    >
      <div
        className={classes.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={classes.closeButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function AddUsers({ setActiveTab, onSelectedUser }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
    adminPanelAccess: true,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isProfileModalActive, setIsProfileModalActive] = useState(false);
  const [agents, setAgents] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userTourBrons, setUserTourBrons] = useState([]);
  const [userHotelBrons, setUserHotelBrons] = useState([]);

  const getBronsForSelectedUser = async (userId) => {
    try {
      const [tourRes, hotelRes] = await Promise.all([
        fetch(`${server}/api/getAgents`),
        fetch(`${server}/api/getHotelBrons`),
      ]);

      const tourData = await tourRes.json();
      const hotelData = await hotelRes.json();

      const filteredTours = tourData.agent.filter(
        (agent) =>
          agent.agent === userId ||
          agent.passengers.some(
            (p) => p.userID === userId || p.name === selectedUser.name
          )
      );

      const filteredHotels = hotelData.hotelBron.filter(
        (bron) => bron.userID === userId
      );

      setUserTourBrons(filteredTours.reverse());
      setUserHotelBrons(filteredHotels.reverse());
    } catch (err) {
      console.error('Ошибка получения броней:', err);
    }
  };

  // Фильтрация

  const [selectedRole, setSelectedRole] = useState('all');

  const filteredAgents =
    selectedRole === 'all'
      ? agents
      : agents.filter((agent) => agent.role === selectedRole);

  // Фильтрация
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${server}/api/user`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Ошибка при получении данных пользователя');
        }
      } catch (error) {
        console.error('Ошибка при запросе пользователя:', error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`${server}/api/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setTimeout(() => {
        setLoading(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          username: '',
          password: '',
          role: 'user',
          adminPanelAccess: true,
        });
        setIsModalActive(false);
        fetchAgents();
      }, 1000);
    } else {
      setLoading(false);
      console.error('Ошибка регистрации');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        const response = await fetch(`${server}/api/deleteUser/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (response.ok) {
          // Обновляем список пользователей после удаления
          // setAgents(agents.filter(agent => agent.id !== userId));
          setAgents(agents.filter((agent) => agent._id !== userId));

          alert('Пользователь успешно удалён');
        } else {
          alert('Не удалось удалить пользователя');
        }
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        alert('Произошла ошибка при удалении пользователя');
      }
    }
  };

  // const fetchAgents = async () => {
  //   const response = await fetch(`${server}/api/getUsers`);
  //   if (response.ok) {
  //     const data = await response.json();
  //     setAgents(data.users);
  //   } else {
  //     console.error('Ошибка загрузки пользователей');
  //   }
  // };

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${server}/api/getUsers`);
      if (!response.ok) throw new Error('Ошибка загрузки пользователей');

      const data = await response.json();
      setAgents(data.users);
    } catch (error) {
      console.error(error);
      alert('Не удалось загрузить список пользователей.');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    getBronsForSelectedUser(user._id);
    setIsProfileModalActive(true);
  };

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function formatDateRange(dateRange) {
    if (!dateRange) return '';
    const [start, end] = dateRange.split(' - ');
    const format = (d) => d.split('-').reverse().join('.');
    return end ? `${format(start)} - ${format(end)}` : format(start);
  }

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
      </div>

      <div className={classes.buttons}>
        <button onClick={() => setSelectedRole('all')}>Все</button>
        <button onClick={() => setSelectedRole('user')}>Пользователи</button>
        <button onClick={() => setSelectedRole('agent')}>Представители</button>
        <button onClick={() => setSelectedRole('admin')}>Администраторы</button>
        <button onClick={() => setSelectedRole('touragent')}>
          Авторы туров
        </button>
      </div>

      <div className={classes.gids}>
        <div className={classes.gidsButton}>
          <div className={classes.gidsButtonLeft}>
            <button onClick={() => setIsModalActive(true)}>
              + Зарегистрировать пользователя
            </button>
          </div>
        </div>

        <div className={classes.tableWrapper}>
          <table className={classes.usersTable}>
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО</th>
                <th>Почта</th>
                <th>Телефон</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      <button
                        className={classes.tableBut}
                        onClick={() => handleProfileClick(item)}
                      >
                        Профиль
                      </button>{' '}
                      <button
                        onClick={() => {
                          onSelectedUser(item);
                          navigate('/admin/brons', { state: item });
                          setActiveTab('brons');
                        }}
                      >
                        Туры
                      </button>
                      {/* Аналогично, если нужен отдельный раздел под отели */}
                      <button
                        onClick={() => {
                          onSelectedUser(item);
                          setActiveTab('addHotelAndApartments');
                        }}
                      >
                        Отели
                      </button>
                      <button
                        className={classes.tableButDel}
                        onClick={() => handleDeleteUser(item._id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    Пользователи не найдены.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модалка регистрации */}
      <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
        <div className={classes.addData}>
          <div className={classes.addData_title}>Регистрация пользователя</div>
          <form onSubmit={handleSubmit} className={classes.registerForm}>
            <input
              type="text"
              name="name"
              placeholder="ФИО"
              value={formData.name}
              required
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Телефон"
              value={formData.phone}
              required
              onChange={handleChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
              onChange={handleChange}
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Пользователь</option>
              <option value="agent">Представитель</option>
              <option value="touragent">Автор тура</option>
              <option value="admin">Администратор</option>
            </select>

            <input
              type="text"
              name="username"
              placeholder="Логин"
              value={formData.username}
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              required
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              Зарегистрировать
            </button>
          </form>
        </div>
      </Modal>

      {/* Модалка просмотра профиля */}
      <Modal
        isActive={isProfileModalActive}
        onClose={() => setIsProfileModalActive(false)}
      >
        {selectedUser && (
          <div className={classes.fullProfile}>
            <h2>Профиль пользователя</h2>
            <p>
              <b>Имя:</b> {selectedUser.name}
            </p>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Телефон:</b> {selectedUser.phone}
            </p>
            <p>
              <b>Логин:</b> {selectedUser.username}
            </p>
            <p>
              <b>Роль:</b> {selectedUser.role}
            </p>

            {/* <p>
                <b>Задолженность:</b>{' '}
                {selectedUser.debt?.toLocaleString('ru-RU')} ₽
              </p> */}

            {userTourBrons.length > 0 && (
              <div className={classes.bronBlock}>
                <h3>Брони туров</h3>
                <table className={classes.bronTable}>
                  <thead>
                    <tr>
                      <th>Дата брони</th>
                      <th>Название тура</th>
                      <th>Дата тура</th>
                      <th>Сумма</th>
                      <th>Оплата</th>
                      <th>Состояние</th>
                      <th>Скачать</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTourBrons.map((bron) => (
                      <tr key={bron._id}>
                        <td>{formatDate(bron.createdAt)}</td>
                        <td>{bron.tours.map((t) => t.tourTitle).join(', ')}</td>
                        <td>{formatDateRange(bron.bookingDate)}</td>
                        <td>{Number(bron.price).toLocaleString('ru-RU')} ₽</td>
                        <td>
                          {bron.paymentType === 'cash' ? 'Наличные' : 'Карта'}
                        </td>
                        <td>
                          {bron.confirm
                            ? '✅ Подтверждено'
                            : '❌ Не подтверждено'}
                        </td>
                        <td>
                          <a
                            href={`${server}/refs/VOUCHER для тура ${bron.tours[0]?.tourTitle} - ${bron.passengers[0]?.name}.docx`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src="/voucher.png"
                              alt="Скачать ваучер"
                              width={20}
                            />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {userHotelBrons.length > 0 && (
              <div className={classes.bronBlock}>
                <h3>Брони отелей</h3>
                <table className={classes.bronTable}>
                  <thead>
                    <tr>
                      <th>Дата брони</th>
                      <th>Название отеля</th>
                      <th>Гостей</th>
                      <th>Сумма</th>
                      <th>Прибытие</th>
                      <th>Выезд</th>
                      <th>Скачать</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userHotelBrons.map((bron) => (
                      <tr key={bron._id}>
                        <td>{formatDate(bron.createdAt)}</td>
                        <td>{bron.name}</td>
                        <td>{bron.guests}</td>
                        <td>
                          {Number(bron.fullPrice).toLocaleString('ru-RU')} ₽
                        </td>
                        <td>{formatDate(bron.arrivalDate)}</td>
                        <td>{formatDate(bron.departureDate)}</td>
                        <td>
                          <a
                            href={`${server}/refs/VOUCHER для отеля ${bron.name} - ${bron.client[0]?.name}.docx`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src="/voucher.png"
                              alt="Скачать ваучер"
                              width={20}
                            />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Feedback />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;
