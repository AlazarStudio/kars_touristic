import React, { useEffect, useState } from 'react';
import classes from './AddUsers.module.css';
import server from '../../../../../serverConfig';
import { useNavigate } from 'react-router-dom';
import { CheckBox } from '@mui/icons-material';

function Modal({ isActive, onClose, children }) {
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
  const [agents, setAgents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileModalActive, setIsProfileModalActive] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      console.error('Registration error');
    }
  };

  const fetchAgents = async () => {
    const response = await fetch(`${server}/api/getUsers`);
    if (response.ok) {
      const data = await response.json();
      const filteredAgents = data.users.filter((user) => user.role === 'user');
      setAgents(filteredAgents);
    } else {
      console.error('Failed to fetch agents');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openProfileModal = (user) => {
    setSelectedUser(user);
    setIsProfileModalActive(true);
  };

  return (
    <div className={classes.container}>
      <div className={classes.containerTop}>
        <button>Пользователи</button>
        <button>Представители</button>
        <button>Администраторы</button>
        <button>Авторы туров</button>
      </div>
      <div className={classes.containerUsers}>
        <div className={classes.containerUsersTop}>
          <div className={classes.containerUsersTopLeft}>
            <button> Выбрать все</button>
            <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
          </div>
        </div>

        <div className={classes.containerUsersTable}>
          <div className={classes.containerUsersTableTop}>
            <span>ФИО</span>
            <span>Почта</span>
            <span>Телефон</span>
          </div>
          <div className={classes.containerUsersBottom}>
            {agents.length > 0
              ? agents.map((item, index) => (
                  <div className={classes.containerUsersBottomInfo} key={index}>
                    <CheckBox />
                    <span className={classes.containerUsersTableBottomEl}>{item.name}</span>
                    <span className={classes.containerUsersTableBottomEl}>{item.email}</span>
                    <span className={classes.containerUsersTableBottomEl}>{item.phone}</span>
                    <button onClick={() => openProfileModal(item)}>Просмотреть профиль</button>
                    <button
                      onClick={() =>
                        navigate('/admin/brons', {
                          state: {
                            name: item.name,
                            paymentType: '',
                            paymentState: '',
                            bronTypeRole: 'user',
                          },
                        })
                      }
                    >
                      Просмотреть бронь
                    </button>
                  </div>
                ))
              : null}
          </div>
        </div>

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
            {loading && (
              <div className={classes.loaderWrapper}>
                <div className={classes.loader}></div>
              </div>
            )}
          </div>
        </Modal>

        <Modal isActive={isProfileModalActive} onClose={() => setIsProfileModalActive(false)}>
          <div className={classes.profileData}>
            <div className={classes.profileData_title}>Профиль пользователя</div>
            {selectedUser && (
              <div>
                <p><strong>ФИО:</strong> {selectedUser.name}</p>
                <p><strong>Почта:</strong> {selectedUser.email}</p>
                <p><strong>Телефон:</strong> {selectedUser.phone}</p>
                <p><strong>Логин:</strong> {selectedUser.username}</p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AddUsers;
