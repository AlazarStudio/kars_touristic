import React, { useState } from 'react';
import classes from './BlockTopInfo.module.css';
import InfoBlock from '../../Standart/InfoBlock/InfoBlock';
import RowBlock from '../../Standart/RowBlock/RowBlock';
import ModalTransfer from '../ModalTransfer/ModalTransfer';

function BlockTopInfo({ children, ...props }) {
  const [open, setOpen] = useState(false);

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
          {props.text && (
            <div className={classes.BlockTopInfo_text}>{props.text}</div>
          )}
        </div>
        <span>
          Трансфер прямо из аэропорта. Заберем в указанном месте и с комфортом
          доставим в любое место назначения. Только опытные водители и
          безопасные поездки!
        </span>
        <button onClick={handleOpen}>Подать заявку</button>
      </div>

      <ModalTransfer open={open} handleClose={handleClose} />
    </>
  );
}

export default BlockTopInfo;
