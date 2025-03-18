import React, { useEffect, useState } from 'react';
import classes from './AddUsers.module.css';
import server from '../../../../../serverConfig';

function Modal({ isActive, onClose, children }) {
  if (!isActive) return null;

  return (
    <div className={`${classes.modal} ${isActive ? classes.active : ''}`} onClick={onClose}>
      <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

function AddUsers({ setActiveTab }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
    adminPanelAccess: true,
  });

  const [loading, setLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isProfileModalActive, setIsProfileModalActive] = useState(false);
  const [agents, setAgents] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const fetchAgents = async () => {
    const response = await fetch(`${server}/api/getUsers`);
    if (response.ok) {
      const data = await response.json();
      setAgents(data.users.filter((user) => user.role === 'user'));
    } else {
      console.error('Ошибка загрузки пользователей');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setIsProfileModalActive(true);
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
  
      </div>

      <div className={classes.buttons}>
        <button>Пользователи</button>
        <button>Представители</button>
        <button>Администраторы</button>
        <button>Авторы туров</button>
      </div>

      <div className={classes.gids}>
        <div className={classes.gidsButton}>
          <div className={classes.gidsButtonLeft}>
          
            <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
          </div>
        
        </div>

        <div className={classes.gids_info1}>
          <div className={classes.gids_info_data}>
            <div className={classes.gids_info__elements2}>
            <div className={classes.gids_info__elem2}><b>Выбрать</b></div>
              <div className={classes.gids_info__elem2}><b>ФИО</b></div>
              <div className={classes.gids_info__elem2}><b>Почта</b></div>
              <div className={classes.gids_info__elem2}><b>Телефон</b></div>
            </div>
          </div>
        </div>

        {agents.length > 0 ? agents.map((item, index) => (
          <div className={classes.gids_info} key={index}>
            <div className={classes.gids_info__elements}>
              {/* <input type='checkbox'/> */}
              <div className={classes.gids_info__elem}>{item.name}</div>
              <div className={classes.gids_info__elem}>{item.email}</div>
              <div className={classes.gids_info__elem}>{item.phone}</div>
            </div>
            <div className={classes.gids_buttons}>
              <button onClick={() => handleProfileClick(item)}>Просмотреть профиль</button>
              <button onClick={() => setActiveTab('brons')}>Просмотреть бронь</button>
            </div>
          </div>
        )) : null}
      </div>

      {/* Модалка регистрации */}
      <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
        <div className={classes.addData}>
          <div className={classes.addData_title}>Регистрация пользователя</div>
          <form onSubmit={handleSubmit} className={classes.registerForm}>
            <input type="text" name="name" placeholder="ФИО" value={formData.name} required onChange={handleChange} />
            <input type="text" name="phone" placeholder="Телефон" value={formData.phone} required onChange={handleChange} />
            <input type="text" name="email" placeholder="Email" value={formData.email} required onChange={handleChange} />
            <input type="text" name="username" placeholder="Логин" value={formData.username} required onChange={handleChange} />
            <input type="password" name="password" placeholder="Пароль" value={formData.password} required onChange={handleChange} />
            <button type="submit" disabled={loading}>Зарегистрировать</button>
          </form>
        </div>
      </Modal>

      {/* Модалка просмотра профиля */}
      <Modal isActive={isProfileModalActive} onClose={() => setIsProfileModalActive(false)}>
        {selectedUser && (
          <div className={classes.profileData}>
            <h3>Профиль пользователя {selectedUser.name}</h3>
            <p>Email: {selectedUser.email}</p>
            <p>Телефон: {selectedUser.phone}</p>
            <p>Логин: {selectedUser.username}</p>
            <p>Роль: {selectedUser.role}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;
