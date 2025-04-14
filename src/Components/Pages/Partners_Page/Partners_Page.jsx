import React, { useEffect, useState } from 'react';
import classes from './Partners_Page.module.css';
import Header_black from '../../Blocks/Header_black/Header_black';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import server from '../../../serverConfig';

function Partners_Page({ children, ...props }) {
  return (
    <>
      <Header_black />

      <CenterBlock>
        <WidthBlock>
          <div className={classes.container}>
            <div className={classes.containerTitle}>НАШИ ПАРТНЕРЫ</div>
            <div className={classes.cardsWrapper}>
              {/* Пример карточки партнёра */}
              <div className={classes.partnerCard}>
                <div className={classes.partnerLogo}>
                  <img src="/logo33.png" alt="Azimuth" />
                </div>
                <div className={classes.partnerContent}>
                  <h3>Azimuth</h3>
                  <p>
                    Azimuth — один из наших ключевых партнёров в сфере
                    авиаперевозок. Мы гордимся сотрудничеством, которое
                    обеспечивает комфорт и надёжность путешествий.
                    Azimuth — один из наших ключевых партнёров в сфере
                    авиаперевозок. Мы гордимся сотрудничеством, которое
                    обеспечивает комфорт и надёжность путешествий.
                    
                  </p>
                  <a
                    className={classes.partnerButton}
                    href="https://azimuth.aero"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Перейти на сайт
                  </a>
                </div>
              </div>
            </div>
          </div>
        </WidthBlock>
      </CenterBlock>
    </>
  );
}

export default Partners_Page;
