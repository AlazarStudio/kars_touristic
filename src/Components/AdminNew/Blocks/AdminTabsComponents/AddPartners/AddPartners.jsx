import React, { useEffect, useState } from 'react';
import classes from './AddPartners.module.css';
import server from '../../../../../serverConfig';
import Form from '../../Form/Form';

function AddPartners({ setActiveTab }) {
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    imgs: [],
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

  const resetAll = () => {
    setFormData({
      name: '',
      description: '',
      link: '',
      imgs: [],
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); 
    setFormData((prev) => ({
      ...prev,
      imgs: files,
    }));
  };

  const initialValues = {
    name: '',
    link: '',
    description: '',
    imgs: [],
  };
  

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <h2>Партнеры</h2>
      </div>

      <Form
        actionUrl={`${server}/api/Partner`}
        method="post"
        resetAll={resetAll}
        initialValues={{}}
        needNavigate={false}
        onTourAdded={fetchPartners}
        customFormData={{ imgs: formData.imgs }} // передаём массив
      >
        <div className={classes.partnerForm}>
          <input
            type="text"
            name="name"
            placeholder="Название партнёра"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Ссылка на сайт"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <input
            type="file"
            name="imgs"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />

          <button type="submit">Добавить партнёра</button>
        </div>
      </Form>

      <div className={classes.partnerList}>
        {partners.length === 0 ? (
          <p>Нет партнёров</p>
        ) : (
          partners.map((partner) => (
            <div className={classes.partnerCard} key={partner.id}>
              <img src={partner.img} alt={partner.name} />
              <div>
                <h3>{partner.name}</h3>
                <p>{partner.description}</p>
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

  async function handleDelete(id) {
    if (!window.confirm('Удалить партнёра?')) return;
    try {
      const res = await fetch(`${server}/api/deletePartner/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPartners();
      } else {
        console.error('Ошибка удаления партнёра');
      }
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  }
}

export default AddPartners;
