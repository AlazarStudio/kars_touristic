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
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const response = await fetch(`${server}/api/getUsers`);
    if (response.ok) {
      const data = await response.json();
      setAgents(data.users.filter((user) => user.role === 'user'));
    } else {
      console.error('Ошибка загрузки пользователей');
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(agents.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = [...prev];
      if (newSelectedUsers.includes(userId)) {
        return newSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...newSelectedUsers, userId];
      }
    });
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(agents.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [selectAll, agents]);
  
  

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setIsProfileModalActive(true);
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
      </div>

      <div className={classes.gids}>
        <div className={classes.gidsButton}>
          <div className={classes.gidsButtonLeft}>
            <button onClick={handleSelectAll}>
              {selectAll ? 'Снять выделение' : 'Выбрать все'}
            </button>
            <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
          </div>
          <div className={classes.gidsButtonRight}>
            <button disabled={selectedUsers.length === 0}>Удалить</button>
            <button disabled={selectedUsers.length !== 1}>Редактировать</button>
          </div>
        </div>

        <div className={classes.gids_info1}>
          <div className={classes.gids_info_data}>
            <div className={classes.gids_info__elements2}>
              <div className={classes.gids_info__elem2}><b>Выбор</b></div>
              <div className={classes.gids_info__elem2}><b>ФИО</b></div>
              <div className={classes.gids_info__elem2}><b>Почта</b></div>
              <div className={classes.gids_info__elem2}><b>Телефон</b></div>
            </div>
          </div>
        </div>

        {agents.map((item) => (
          <div className={classes.gids_info} key={item.id}>
            <div className={classes.gids_info__elements}>
              <div className={classes.gids_info__elem}>
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(item.id)} 
                  onChange={() => handleSelectUser(item.id)}
                />
              </div>
              <div className={classes.gids_info__elem}>{item.name}</div>
              <div className={classes.gids_info__elem}>{item.email}</div>
              <div className={classes.gids_info__elem}>{item.phone}</div>
            </div>
            <div className={classes.gids_buttons}>
              <button onClick={() => handleProfileClick(item)}>Просмотреть профиль</button>
              <button onClick={() => setActiveTab('brons')}>Просмотреть бронь</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
        <div className={classes.addData}>
          <div className={classes.addData_title}>Регистрация пользователя</div>
          <form className={classes.registerForm}>
            <input type="text" name="name" placeholder="ФИО" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="text" name="phone" placeholder="Телефон" value={formData.phone} required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <input type="text" name="email" placeholder="Email" value={formData.email} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="text" name="username" placeholder="Логин" value={formData.username} required onChange={(e) => setFormData({...formData, username: e.target.value})} />
            <input type="password" name="password" placeholder="Пароль" value={formData.password} required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="submit" disabled={loading}>Зарегистрировать</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddUsers;
