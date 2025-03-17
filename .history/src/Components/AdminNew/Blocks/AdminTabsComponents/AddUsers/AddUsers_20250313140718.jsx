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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleEditClick = () => {
    const user = agents.find((u) => u.id === selectedUserId);
    if (user) {
      setSelectedUser(user);
      setIsEditModalActive(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${server}/api/updateUser/${selectedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser),
    });

    if (response.ok) {
      fetchAgents();
      setIsEditModalActive(false);
    } else {
      console.error('Ошибка обновления данных');
    }
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.gidsButtonRight}>
        <button onClick={handleEditClick} disabled={!selectedUserId}>Редактировать</button>
      </div>

      <div className={classes.gids_info1}>
        {agents.map((item) => (
          <div className={classes.gids_info} key={item.id}>
            <input
              type="checkbox"
              checked={selectedUserId === item.id}
              onChange={() => handleUserSelect(item.id)}
            />
            <div className={classes.gids_info__elem}>{item.name}</div>
            <div className={classes.gids_info__elem}>{item.email}</div>
            <div className={classes.gids_info__elem}>{item.phone}</div>
          </div>
        ))}
      </div>

      {/* Модалка редактирования */}
      <Modal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)}>
        {selectedUser && (
          <form onSubmit={handleEditSubmit} className={classes.registerForm}>
            <input type="text" name="name" value={selectedUser.name} onChange={handleEditChange} required />
            <input type="text" name="phone" value={selectedUser.phone} onChange={handleEditChange} required />
            <input type="text" name="email" value={selectedUser.email} onChange={handleEditChange} required />
            <button type="submit">Сохранить</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;
