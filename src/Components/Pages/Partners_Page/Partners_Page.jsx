import React, { useEffect, useState } from 'react';
import classes from './Partners_Page.module.css';
import Header_black from '../../Blocks/Header_black/Header_black';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import server from '../../../serverConfig';

function Partners_Page() {
  const [partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${server}/api/getPartner`);
      const data = await res.json();
      setPartners(data.partner || []);
    } catch (error) {
      console.error('Ошибка при загрузке партнёров:', error);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return (
    <>
      <Header_black />
      <CenterBlock>
        <WidthBlock>
          <div className={classes.container}>
            <div className={classes.containerTitle}>НАШИ ПАРТНЕРЫ</div>

            <div className={classes.cardsWrapper}>
              {partners.length === 0 ? (
                <p>Партнёры не найдены</p>
              ) : (
                partners.map((partner) => (
                  <div className={classes.partnerCard} key={partner._id}>
                    <div className={classes.partnerLogo}>
                      {Array.isArray(partner.img) &&
                        partner.img.map((imgPath, index) => (
                          <img
                            key={index}
                            src={`${server}/refs/${imgPath}`}
                            alt={partner.name}
                            className={classes.partnerImage}
                          />
                        ))}
                    </div>
                    <div className={classes.partnerContent}>
                      <h3>{partner.name}</h3>
                      <p>{partner.description}</p>
                      {partner.link && (
                        <a
                          className={classes.partnerButton}
                          href={partner.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Перейти на сайт
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </WidthBlock>
      </CenterBlock>
    </>
  );
}

export default Partners_Page;
