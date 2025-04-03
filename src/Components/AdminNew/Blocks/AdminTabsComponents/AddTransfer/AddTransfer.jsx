import React from 'react';
import classes from './AddTransfer.module.css';
import server from '../../../../../serverConfig';

function AddTransfer({ transferRequests = [], fetchTransferRequests }) {
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
    <div className={classes.addData}>
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
  );
}

export default AddTransfer;
