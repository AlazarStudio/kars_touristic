import React, { useEffect, useState } from 'react';
import classes from './AddPartners.module.css';
import server from '../../../../../serverConfig';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={classes.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

function AddPartners({ setActiveTab }) {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    img: ''
  });

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${server}/api/getPartners`);
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (err) {
      console.error('Ошибка при получении партнеров:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${server}/api/addPartner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', description: '', link: '', img: '' });
        fetchPartners();
        setIsModalOpen(false);
      } else {
        console.error('Ошибка при добавлении партнера');
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить партнера?')) return;
    try {
      const res = await fetch(`${server}/api/deletePartner/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPartners();
      } else {
        console.error('Ошибка удаления');
      }
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <h2>Партнеры</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Добавить партнёра</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className={classes.partnerForm}>
          <input
            type="text"
            name="name"
            placeholder="Название партнера"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Ссылка на сайт"
            value={formData.link}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="img"
            placeholder="Ссылка на логотип"
            value={formData.img}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Сохранить</button>
        </form>
      </Modal>

      <div className={classes.partnerList}>
        {partners.length === 0 ? (
          <p>Нет партнеров</p>
        ) : (
          partners.map((partner) => (
            <div className={classes.partnerCard} key={partner.id}>
              <img src={partner.img} alt={partner.name} />
              <div>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <a href={partner.link} target="_blank" rel="noopener noreferrer">
                  Перейти на сайт
                </a>
              </div>
              <button onClick={() => handleDelete(partner.id)}>Удалить</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddPartners;
