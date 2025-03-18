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
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
    } else {
      setLoading(false);
      console.error('Ошибка регистрации');
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${server}/api/deleteUser/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchAgents();
    } else {
      console.error('Ошибка удаления пользователя');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(`${server}/api/updateUser/${selectedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser),
    });

    if (response.ok) {
      setLoading(false);
      setIsEditModalActive(false);
      fetchAgents();
    } else {
      setLoading(false);
      console.error('Ошибка редактирования');
    }
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
      </div>
      <button onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</button>
      {agents.map((item, index) => (
        <div className={classes.gids_info} key={index}>
          <div>{item.name}</div>
          <div>{item.email}</div>
          <div>{item.phone}</div>
          <button onClick={() => { setSelectedUser(item); setIsProfileModalActive(true); }}>Просмотр</button>
          <button onClick={() => { setSelectedUser(item); setIsEditModalActive(true); }}>Редактировать</button>
          <button onClick={() => handleDelete(item.id)}>Удалить</button>
        </div>
      ))}

      <Modal isActive={isModalActive} onClose={() => setIsModalActive(false)}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="ФИО" value={formData.name} required onChange={handleChange} />
          <input type="text" name="phone" placeholder="Телефон" value={formData.phone} required onChange={handleChange} />
          <input type="text" name="email" placeholder="Email" value={formData.email} required onChange={handleChange} />
          <input type="text" name="username" placeholder="Логин" value={formData.username} required onChange={handleChange} />
          <input type="password" name="password" placeholder="Пароль" value={formData.password} required onChange={handleChange} />
          <button type="submit" disabled={loading}>Зарегистрировать</button>
        </form>
      </Modal>

      <Modal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)}>
        {selectedUser && (
          <form onSubmit={handleEdit}>
            <input type="text" name="name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} required />
            <input type="text" name="phone" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} required />
            <input type="text" name="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} required />
            <button type="submit" disabled={loading}>Сохранить</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;