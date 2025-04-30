import React, { useState, useEffect } from 'react';
import classes from './AddFAQ.module.css';
import Form from '../../Form/Form';

import server from '../../../../../serverConfig';
import Accordion from '../../../../Blocks/Accordion/Accordion';

function AddFAQ({ children, activeTab, ...props }) {
  const [faq, setFaq] = useState([]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    fetchDescription();
    fetchFaq();
  }, []);

  const fetchDescription = async () => {
    try {
      const response = await fetch(`${server}/api/getFaqInfo`);
      const data = await response.json();
      setDescription(data.description || '');
      setImages(data.images || []);
    } catch (error) {
      console.error('Ошибка при загрузке описания FAQ:', error);
    }
  };

  const fetchFaq = async () => {
    try {
      const response = await fetch(`${server}/api/faq`);
      const data = await response.json();
      setFaq(data);
    } catch (error) {
      console.error('Ошибка при загрузке FAQ:', error);
    }
  };

  const handleFormSuccess1 = async () => {
    await fetchDescription();
  };

  const handleFormSuccess = async () => {
    await fetchFaq();
  };

  const toggleDescriptionVisibility = () => {
    setShowDescription((prev) => !prev);
  };

  return (
    <div className={classes.addData}>
      <div className={classes.addData1}>
        <button onClick={toggleDescriptionVisibility}>
          {showDescription
            ? 'Скрыть описание'
            : 'Нажмите для изменения описания страницы FAQ'}
        </button>

        {showDescription && (
          <>
            {description && (
              <div className={classes.companyInfo}>
                <h3>Текущее описание FAQ:</h3>
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
              actionUrl={`${server}/api/faqInfo`}
              method="put"
              type="multipart"
              onSuccess={handleFormSuccess1}
            >
              <label>Добавить краткое описание компании</label>
              <textarea
                name="description"
                placeholder="Описание"
                required
                defaultValue={description}
              />
              <label>Загрузите изображения</label>
              <input type="file" name="images" multiple accept="image/*" />
              <button type="submit">Сохранить описание и изображения</button>
            </Form>
          </>
        )}
      </div>

      <div className={classes.addData_title}>FAQ</div>

      <Form
        actionUrl={`${server}/api/faq`}
        method="post"
        type="query"
        onSuccess={handleFormSuccess}
      >
        <label>Введите вопрос</label>
        <input name="question" type="text" placeholder="Название" required />

        <label>Введите ответ</label>
        <textarea name="answer" placeholder="Описание" required />

        <button type="submit">Добавить Вопрос</button>
      </Form>

      <br />
      {faq.length > 0 && (
        <div className={classes.addData_title}>Текущий FAQ</div>
      )}
      {faq.length > 0 && (
        <Accordion
          items={faq}
          needDelete={true}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default AddFAQ;
