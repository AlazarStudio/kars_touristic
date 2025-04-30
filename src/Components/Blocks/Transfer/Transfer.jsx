import React, { useEffect, useState } from 'react';
import classes from './Transfer.module.css';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import BlockTopInfo from '../BlockTopInfo/BlockTopInfo';

import tg from '/tg.webp';
import transfer_bg from '/transfer_bg.webp';
import Preloader from '../Preloader/Preloader';

import server from '../../../serverConfig';

function Transfer({ children, data, ...props }) {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
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
              topTitle={'Kars Drive'}
              title={data.title}
              text={description}
              link={data.link}
              linkText={'НАПИСАТЬ В TELEGRAM'}
              bgImg={
                images.length > 0 ? `${server}/refs/${images[0]}` : transfer_bg
              }
              iconImg={tg}
              mb={'40px'}
            />
          </WidthBlock>
        </CenterBlock>
      )}
    </>
  );
}

export default Transfer;
