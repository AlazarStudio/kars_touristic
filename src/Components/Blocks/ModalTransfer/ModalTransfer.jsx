import React, { useState } from 'react';
import classes from './ModalTransfer.module.css';
import server from '../../../serverConfig';

function ModalTransfer({ open, handleClose }) {
  const [formData, setFormData] = useState({
    region: '',
    from: '',
    to: '',
    passengers: '',
    dateTime: '',
    transportClass: '',
    transportType: '',
    additionalServices: '',
    personName: '',
    personPhone: '',
    personEmail: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${server}/api/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Заявка успешно отправлена!');
        handleClose();
      } else {
        alert('Ошибка при отправке.');
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      alert('Ошибка при отправке.');
    }
  };

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div className={classes.modalOverlay} onClick={handleOverlayClick}>
      <div className={classes.modalContent}>
        <h2>Заявка на трансфер</h2>
        <form className={classes.modalForm} onSubmit={handleSubmit}>
          <input
            name="region"
            value={formData.region}
            onChange={handleChange}
            type="text"
            placeholder="Регион"
            required
          />
          <input
            name="from"
            value={formData.from}
            onChange={handleChange}
            type="text"
            placeholder="Пункт отправления"
            required
          />
          <input
            name="to"
            value={formData.to}
            onChange={handleChange}
            type="text"
            placeholder="Пункт прибытия"
            required
          />
          <input
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            type="number"
            placeholder="Кол-во пассажиров"
            required
          />
          <input
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            type="datetime-local"
            placeholder="Дата и время"
            required
          />
          <select 
            name="transportClass"
            value={formData.transportClass}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Выберите класс авто
            </option>
            <option value="Эконом">Эконом</option>
            <option value="Комфорт">Комфорт</option>
            <option value="Бизнес">Бизнес</option>
            <option value="Минивэн">Минивэн</option>
            <option value="Автобус">Автобус</option>
          </select>

          <input
            name="transportType"
            value={formData.transportType}
            onChange={handleChange}
            type="text"
            placeholder="Посадочные места и сегмент"
          />
          <input
            name="additionalServices"
            value={formData.additionalServices}
            onChange={handleChange}
            type="text"
            placeholder="Наличие багажа или снаряжения"
          />
          <input
            name="personName"
            value={formData.personName}
            onChange={handleChange}
            type="text"
            placeholder="ФИО"
            required
          />
          <input
            name="personPhone"
            value={formData.personPhone}
            onChange={handleChange}
            type="tel"
            placeholder="Номер телефона"
            required
          />
          <input
            name="personEmail"
            value={formData.personEmail}
            onChange={handleChange}
            type="email"
            placeholder="Почта"
            required
          />

          <div className={classes.modalButtons}>
            <button type="submit">Отправить</button>
            <button type="button" onClick={handleClose}>
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalTransfer;
