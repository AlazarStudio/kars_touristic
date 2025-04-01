import React, { useEffect, useState } from 'react';
import classes from './AddTransfer.module.css';
import Form from '../../Form/Form';

import server from '../../../../../serverConfig';
import Transfer from '../../../../Blocks/Transfer/Transfer';

function AddTransfer({ children, activeTab, ...props }) {
  const [transferInfo, setTransferInfo] = useState('');
  const [transferRequests, setTransferRequests] = useState([]); // для заявок

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${server}/api/transfer`);
        const data = await res.json();
        setTransferRequests(data);
      } catch (error) {
        console.error('Ошибка при получении заявок:', error);
      }
    }

    fetchData();
  }, []);

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
        // Удаление из локального состояния
        setTransferRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        alert('Ошибка при удалении');
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
    }
  };

  // useEffect(() => {
  //     async function fetchMissionInfo() {
  //         try {
  //             const response = await fetch(`${server}/api/transfer`);
  //             const data = await response.json();
  //             setTransferInfo(data);
  //         } catch (error) {
  //             console.error("Error fetching transfer info:", error);
  //         }
  //     }

  //     fetchMissionInfo();
  // }, []);

  // async function handleFormSuccess() {
  //     try {
  //         const response = await fetch(`${server}/api/transfer`);
  //         const data = await response.json();
  //         setTransferInfo(data);
  //     } catch (error) {
  //         console.error("Error fetching transfer info after form submission:", error);
  //     }
  // }

  return (
    <div className={classes.addData}>
      {transferRequests.length > 0 && (
        <div className={classes.requestsTableWrapper}>
          <div className={classes.addData_title}>Заявки на трансфер</div>
          <table className={classes.requestsTable}>
            <thead>
              <tr>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transferRequests.map((req, index) => (
                <tr key={index}>
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
                  <td>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className={classes.deleteButton}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* <div className={classes.addData_title}>Трансфер</div> */}

      {/* <Form actionUrl={`${server}/api/transfer`} method="put" type={'query'}  onSuccess={handleFormSuccess}>
                <label>Введите заголовок</label>
                <input name="title" type="text" placeholder="Название"  />

                <label>Добавить краткое описание раздела</label>
                <textarea name="description" placeholder="Описание"  />
                
                <label>Введите ссылку на телеграмм</label>
                <input name="link" type="text" placeholder="https://t.me/username"  />

                <button type="submit">Добавить трансфер</button>
            </Form> */}
      {/* 
            {transferInfo ? <div className={classes.addData_title}>Текущий трансфер:</div> : null}

            {transferInfo ? <Transfer data={transferInfo}/> : null} */}
    </div>
  );
}

export default AddTransfer;
