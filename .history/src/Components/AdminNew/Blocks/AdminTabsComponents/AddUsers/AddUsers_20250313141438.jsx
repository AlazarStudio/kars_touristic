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
  });

  const [loading, setLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${server}/api/getUsers`);
      if (response.ok) {
        const data = await response.json();
        setAgents(data.users.filter((user) => user.role === 'user'));
      } else {
        console.error('Ошибка загрузки пользователей');
      }
    } catch (error) {
      console.error('Ошибка при запросе пользователей:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого пользователя?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${server}/api/deleteUser/${selectedUserId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Пользователь удален');
        setSelectedUserId(null);
        fetchAgents();
      } else {
        console.error('Ошибка удаления пользователя');
      }
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  const handleEditUser = () => {
    if (!selectedUserId) return;

    const userToEdit = agents.find((user) => user.id === selectedUserId);
    if (userToEdit) {
      setFormData({
        name: userToEdit.name,
        phone: userToEdit.phone,
        email: userToEdit.email,
        username: userToEdit.username,
        password: '',
        role: userToEdit.role,
      });
      setIsEditModalActive(true);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${server}/api/updateUser/${selectedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Данные пользователя обновлены');
        setIsEditModalActive(false);
        fetchAgents();
      } else {
        console.error('Ошибка при обновлении пользователя');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    } finally {
      setLoading(false);
    }
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
          <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
          <button onClick={handleDeleteUser} disabled={!selectedUserId}>Удалить</button>
          <button onClick={handleEditUser} disabled={!selectedUserId}>Редактировать</button>
        </div>

        <div className={classes.gids_info1}>
          <div className={classes.gids_info_data}>
            <div className={classes.gids_info__elements2}>
              <div className={classes.gids_info__elem2}><b>ФИО</b></div>
              <div className={classes.gids_info__elem2}><b>Почта</b></div>
              <div className={classes.gids_info__elem2}><b>Телефон</b></div>
            </div>
          </div>
        </div>

        {agents.length > 0 ? agents.map((item) => (
          <div
            key={item.id}
            className={`${classes.gids_info} ${selectedUserId === item.id ? classes.selected : ''}`}
            onClick={() => setSelectedUserId(item.id)}
          >
            <div className={classes.gids_info__elements}>
              <div className={classes.gids_info__elem}>{item.name}</div>
              <div className={classes.gids_info__elem}>{item.email}</div>
              <div className={classes.gids_info__elem}>{item.phone}</div>
            </div>
          </div>
        )) : <p>Нет пользователей</p>}
      </div>

      {/* Модалка регистрации */}
      <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
        <form onSubmit={handleSaveEdit} className={classes.registerForm}>
          <input type="text" name="name" placeholder="ФИО" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="text" name="phone" placeholder="Телефон" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <input type="text" name="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="text" name="username" placeholder="Логин" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
          <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button type="submit" disabled={loading}>Сохранить</button>
        </form>
      </Modal>
    </div>
  );
}

export default AddUsers;
