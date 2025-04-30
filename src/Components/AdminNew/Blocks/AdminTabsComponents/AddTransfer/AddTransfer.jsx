import React, { useEffect, useState } from 'react';
import classes from './AddTransfer.module.css';
import server from '../../../../../serverConfig';
import Form from '../../Form/Form';

function AddTransfer({ transferRequests = [], fetchTransferRequests }) {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    // Функция для получения описания с сервера
    async function fetchDescription() {
      try {
        const response = await fetch(`${server}/api/getTransferInfo`);
        const data = await response.json();
        setDescription(data.description); // Устанавливаем описание в состояние
        setImages(data.images || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных компании:', error);
      }
    }

    fetchDescription();
  }, []);

  // Функция, которая вызывается после успешной отправки формы
  const handleFormSuccess = async () => {
    try {
      // После отправки формы обновляем описание
      const response = await fetch(`${server}/api/getTransferInfo`);
      const data = await response.json();
      setDescription(data.description); // Обновляем описание сразу после успешной отправки
    } catch (error) {
      console.error('Ошибка при обновлении описания компании:', error);
    }
  };

  
  const toggleDescriptionVisibility = () => {
    setShowDescription((prev) => !prev); // Переключаем видимость
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Вы уверены, что хотите удалить эту заявку?'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${server}/api/transfer/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchTransferRequests(); // Обновить данные после удаления
      } else {
        alert('Ошибка при удалении');
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
    }
  };

  const handleProcess = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; // переключаем

      const res = await fetch(`${server}/api/transfer/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }), // переключаемый статус
      });

      if (res.ok) {
        fetchTransferRequests(); // обновляем данные
      } else {
        const text = await res.text();
        alert(`Ошибка: ${text}`);
      }
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      alert('Ошибка при обновлении статуса');
    }
  };

  return (
    <>
      <div className={classes.addData}>
        <div className={classes.addData1}>
          {/* Кнопка для отображения/скрытия описания */}
          <button onClick={toggleDescriptionVisibility}>
            {showDescription
              ? 'Скрыть описание'
              : 'Нажмите для изменения описания страницы Трансфер'}
          </button>

          {showDescription && (
            <>
              {description && (
                <div className={classes.companyInfo}>
                  <h3>Текущее описание трансфера:</h3>
                  <p>{description}</p>
                </div>
              )}

              {images.length > 0 && (
                <div className={classes.imagePreview}>
                  <h4>Загруженные изображения:</h4>
                  <div className={classes.imageList}>
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={`${server}/refs/${img}`} // 👈 обязательно добавляем `/refs/`
                        alt={`faq-img-${index}`}
                        style={{
                          width: '150px',
                          marginRight: '10px',
                          borderRadius: '8px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Form
                actionUrl={`${server}/api/transferInfo`}
                method="put"
               type="multipart"
                onSuccess={handleFormSuccess}
              >
                <label>Добавить краткое описание компании</label>
                <textarea
                  name="description"
                  placeholder="Описание"
                  required
                  defaultValue={description} // Отображаем текущее описание в поле
                />
                <label>Загрузите изображения</label>
                <input type="file" name="images" multiple accept="image/*" />
                <button type="submit">Добавить описание компании</button>
              </Form>
            </>
          )}
        </div>

        {transferRequests.length > 0 ? (
          <div className={classes.requestsTableWrapper}>
            <div className={classes.addData_title}>Заявки на трансфер</div>
            <table className={classes.requestsTable}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>ФИО</th>
                  <th>Точка А</th>
                  <th>Точка В</th>
                  <th>Дата и время</th>
                  <th>Пассажиры</th>
                  <th>Телефон</th>
                  <th>Регион</th>
                  <th>Класс авто</th>
                  <th>Сегмент</th>
                  <th>Багаж</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {transferRequests.map((req, index) => (
                  <tr
                    key={req._id}
                    className={req.status === true ? classes.processedRow : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{req.personName}</td>
                    <td>{req.from}</td>
                    <td>{req.to}</td>
                    <td>
                      {new Date(req.dateTime).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>{req.passengers}</td>
                    <td>{req.personPhone}</td>
                    <td>{req.region}</td>
                    <td>{req.transportClass}</td>
                    <td>{req.transportType}</td>
                    <td>{req.additionalServices}</td>
                    <td>{req.status ? 'Обработано' : 'Не обработано'}</td>
                    <td>
                      <button
                        onClick={() => handleProcess(req._id, req.status)}
                        className={classes.processButton}
                      >
                        {req.status ? 'Отменить' : 'Обработать'}
                      </button>

                      <button
                        onClick={() => handleDelete(req._id)}
                        className={classes.deleteButton}
                        style={{ marginLeft: 8 }}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={classes.noRequests}>Заявок пока нет.</p>
        )}
      </div>
    </>
  );
}

export default AddTransfer;
