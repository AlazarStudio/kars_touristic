import React, { useState } from 'react';
import classes from './BlockTopInfo.module.css';
import InfoBlock from '../../Standart/InfoBlock/InfoBlock';
import RowBlock from '../../Standart/RowBlock/RowBlock';
import ModalTransfer from '../ModalTransfer/ModalTransfer';

import { useLocation } from 'react-router-dom'; // Импортируем useLocation

function BlockTopInfo({ children, ...props }) {
  const [open, setOpen] = useState(false);

  const location = useLocation(); // Получаем текущий маршрут
  const isTransferPage = location.pathname === '/transfer';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        className={classes.BlockTopInfo}
        style={{
          backgroundImage: `url(${props.bgImg})`,
          marginBottom: props.mb,
        }}
      >
        <div className={classes.BlockTopInfo_block}>
          {props.topTitle && (
            <div className={classes.BlockTopInfo_topTitle}>
              {props.topTitle}
            </div>
          )}
          {props.title && (
            <div className={classes.BlockTopInfo_title}>{props.title}</div>
          )}

          {props.description && (
            <div className={classes.BlockTopInfo_title}>
              {props.description}
            </div>
          )}
          {props.text && (
            <div className={classes.BlockTopInfo_text}>{props.text}</div>
          )}
        </div>
       
         {/* Показываем кнопку только если маршрут /transfer */}
         {isTransferPage && (
          <>
            <button onClick={handleOpen}>Подать заявку</button>
            <ModalTransfer open={open} handleClose={handleClose} />
          </>
        )}

      </div>

      <ModalTransfer open={open} handleClose={handleClose} />
    </>
  );
}

export default BlockTopInfo;
