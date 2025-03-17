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
  const [agents, setAgents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

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

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === agents.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(agents.map((user) => user.id));
    }
  };

  const deleteSelectedUsers = async () => {
    for (const userId of selectedUsers) {
      await fetch(`${server}/api/deleteUser/${userId}`, { method: 'DELETE' });
    }
    setSelectedUsers([]);
    fetchAgents();
  };

  const handleEditUser = (user) => {
    setEditFormData(user);
    setIsEditModalActive(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${server}/api/updateUser/${editFormData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData),
    });

    if (response.ok) {
      setIsEditModalActive(false);
      fetchAgents();
    } else {
      console.error('Ошибка обновления данных');
    }
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
        {/* <div className={classes.multidayTours_top__user}>
          <span className={classes.multidayTours_top__date}>
            {new Date().toLocaleDateString('ru-RU', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
            })}
          </span>
          {user ? `${user.name} (${user.role})` : 'Загрузка...'}
        </div> */}
      </div>

      <div className={classes.buttons}>
        <button>Пользователи</button>
        <button>Представители</button>
        <button>Администраторы</button>
        <button>Авторы туров</button>
      </div>
       <div className={classes.gidsButton}>
      <div className={classes.gidsButton}>
        <div className={classes.gidsButtonLeft}>
          <button onClick={selectAllUsers}>Выбрать все</button>
          <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
        </div>
        <div className={classes.gidsButtonRight}>
          <button onClick={deleteSelectedUsers} disabled={selectedUsers.length === 0}>Удалить</button>
          <button onClick={() => handleEditUser(agents.find(u => selectedUsers.includes(u.id)))} disabled={selectedUsers.length !== 1}>Редактировать</button>
        </div>
      </div>

      {agents.map((user) => (
        <div key={user.id} className={classes.gids_info}>
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={() => toggleSelectUser(user.id)}
          />
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div>{user.phone}</div>
        </div>
      ))}

      {/* Модалка редактирования */}
      <Modal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)}>
        {editFormData && (
          <form onSubmit={handleEditSubmit}>
            <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} required />
            <input type="text" name="email" value={editFormData.email} onChange={handleEditChange} required />
            <input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} required />
            <button type="submit">Сохранить</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;
