import React, { useState, useEffect } from 'react';
import classes from './Faq.module.css';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import BlockTopInfo from '../BlockTopInfo/BlockTopInfo';
import Accordion from '../Accordion/Accordion';

import faq_bg from '/faq_bg.webp';
import server from '../../../serverConfig';
import Preloader from '../Preloader/Preloader';

function Faq({ children, ...props }) {
  const [faq, setFaq] = useState([]);

  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchDescription() {
      try {
        const response = await fetch(`${server}/api/getFaqInfo`);
        const data = await response.json();
        setDescription(data.description);
        setImages(data.images || []); // 👈 сохраняем изображения
      } catch (error) {
        console.error('Ошибка при загрузке данных FAQ:', error);
      }
    }

    fetchDescription();
  }, []);

  useEffect(() => {
    async function fetchFaq() {
      try {
        const response = await fetch(`${server}/api/faq`);
        const data = await response.json();
        setFaq(data);
      } catch (error) {
        console.error('Error fetching faq info:', error);
      }
    }

    fetchFaq();
  }, []);

  const [preloaderShowFirst, setPreloaderShowFirst] = useState(true);

  setTimeout(() => {
    setPreloaderShowFirst(false);
  }, 500);
  return (
    <>
      {preloaderShowFirst ? (
        <Preloader />
      ) : (
        <CenterBlock>
          <WidthBlock>
            <BlockTopInfo
              topTitle={'FAQ'}
              text={description}
              bgImg={images.length > 0 ? `${server}/refs/${images[0]}` : faq_bg}
            />

            <Accordion items={faq} />
          </WidthBlock>
        </CenterBlock>
      )}
    </>
  );
}

export default Faq;
