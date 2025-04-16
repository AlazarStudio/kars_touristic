import React, { useEffect, useState, useRef } from 'react';
import classes from './AddPartners.module.css';
import server from '../../../../../serverConfig';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function AddPartners() {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    imgs: [],
  });

  const [existingImgs, setExistingImgs] = useState([]);

  const fileInputRef = useRef(null);

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${server}/api/getPartner`);
      const data = await res.json();
      setPartners(data.partner || []);
    } catch (err) {
      console.error('Ошибка при получении партнёров:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    resetAll();
    setIsModalOpen(false);
  };

  const resetAll = () => {
    setFormData({
      name: '',
      description: '',
      link: '',
      imgs: [],
    });
    setExistingImgs([]); // сбросить старые изображения
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imgs: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('link', formData.link);
    payload.append('description', formData.description);

    formData.imgs.forEach((file) => {
      payload.append('img', file);
    });

    // ⚠️ Если редактируем и есть новые картинки — скажем бэку удалить старые
    if (editId && formData.imgs.length > 0 && existingImgs.length > 0) {
      payload.append('imgToDelete', JSON.stringify(existingImgs));
    }

    const url = editId
      ? `${server}/api/updateOnePartner/${editId}`
      : `${server}/api/Partner`;
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: payload,
      });

      if (res.ok) {
        closeModal();
        fetchPartners();
      } else {
        const errorText = await res.text();
        console.error('Ошибка при сохранении партнёра:', errorText);
      }
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить партнёра?')) return;
    try {
      const res = await fetch(`${server}/api/deletePartner/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchPartners();
    } catch (err) {
      console.error('Ошибка запроса:', err);
    }
  };

  const handleEdit = (partner) => {
    setFormData({
      name: partner.name,
      description: partner.description,
      link: partner.link,
      imgs: [],
    });
    setExistingImgs(partner.img || []); // сохрани текущие изображения
    setEditId(partner._id);
    if (fileInputRef.current) fileInputRef.current.value = '';
    openModal();
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <h2>Партнёры</h2>
        <button onClick={openModal} className={classes.addButton}>
          Добавить партнёра
        </button>
      </div>

      {/* Модальное окно */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        className={classes.modalContent}
        overlayClassName={classes.modalBackdrop}
      >
        <button className={classes.closeButton} onClick={closeModal}>
          &times;
        </button>
        {/* {editId && existingImgs.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            {existingImgs.map((img, i) => (
              <img
                key={i}
                src={`${server}/refs/${img}`}
                alt="partner-img"
                style={{ width: '80px', height: 'auto', borderRadius: '8px' }}
              />
            ))}
          </div>
        )} */}

        <form onSubmit={handleSubmit} className={classes.partnerForm}>
          <input
            type="text"
            name="name"
            placeholder="Название"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Ссылка на сайт"
            value={formData.link}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className={classes.formButtons}>
            <button type="submit" className={classes.saveButton}>
              {editId ? 'Сохранить изменения' : 'Добавить'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className={classes.cancelButton}
            >
              Отмена
            </button>
          </div>
        </form>
      </ReactModal>

      {/* Список партнёров */}
      <div className={classes.partnerList}>
  {partners.length === 0 ? (
    <p>Нет партнёров</p>
  ) : (
<table className={classes.partnerTable}>
  <thead>
    <tr>
      <th>№</th>
      <th>Изображение</th>
      <th>Название</th>
      <th>Описание</th>
      <th>Ссылка</th>
      <th>Действия</th>
    </tr>
  </thead>
  <tbody>
    {partners.map((partner, index) => (
      <tr key={partner._id}>
        <td>{index + 1}</td>
        <td>
          {partner.img?.length > 0 && (
            <img
              src={`${server}/refs/${partner.img[0]}`}
              alt="partner"
              className={classes.partnerImage}
            />
          )}
        </td>
        <td>{partner.name}</td>
        <td>{partner.description}</td>
        <td>
          <a
            href={partner.link}
            target="_blank"
            rel="noreferrer"
            className={classes.partnerLink}
          >
            {partner.link}
          </a>
        </td>
        <td>
          <div className={classes.cardButtons}>
            <button onClick={() => handleEdit(partner)}>Редактировать</button>
            <button onClick={() => handleDelete(partner._id)}>Удалить</button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  )}
</div>

    </div>
  );
}

export default AddPartners;
