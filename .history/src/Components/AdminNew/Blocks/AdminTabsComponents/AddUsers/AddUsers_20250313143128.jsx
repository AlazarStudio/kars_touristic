import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;

    const response = await fetch(`${server}/api/deleteUser/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchAgents();
    } else {
      console.error('Ошибка удаления пользователя');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalActive(true);
    setFormData(user);
  };

  return (
    <div className={classes.multidayTours}>
      <div className={classes.multidayTours_top}>
        <div className={classes.multidayTours_top__title}>Пользователи</div>
      </div>

      <Button variant="contained" onClick={() => setIsModalActive(true)}>+ Зарегистрировать пользователя</Button>
      
      {agents.map((user) => (
        <div key={user.id} className={classes.userItem}>
          <span>{user.name}</span>
          <IconButton onClick={() => handleEdit(user)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
        </div>
      ))}

      {/* Модалка редактирования */}
      <Modal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)}>
        {selectedUser && (
          <form onSubmit={handleEdit}>
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            <input type="text" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <input type="text" name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            <Button type="submit" variant="contained" disabled={loading}>Сохранить изменения</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AddUsers;
