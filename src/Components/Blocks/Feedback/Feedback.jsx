import React, { useEffect, useState } from 'react';
import classes from './Feedback.module.css';
import axios from 'axios';

import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import server from '../../../serverConfig';

function Feedback({ hotelID, roomID, multiTourID, oneTourID, autorTourID }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const queryParams = [];

    if (hotelID) queryParams.push(`hotelID=${hotelID}`);
    if (roomID) queryParams.push(`roomID=${roomID}`);
    if (multiTourID) queryParams.push(`multiTourID=${multiTourID}`);
    if (oneTourID) queryParams.push(`oneTourID=${oneTourID}`);
    if (autorTourID) queryParams.push(`autorTourID=${autorTourID}`);

    if (queryParams.length === 0) return;

    const queryString = queryParams.join('&');

    axios
      .get(`${server}/api/getReview?${queryString}`)
      .then((res) => {
        setFeedbacks(res.data.reviews || []);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке отзывов:', err);
        if (err.response) {
          console.error(
            'Ответ сервера:',
            err.response.status,
            err.response.data
          );
        }
      });
  }, [hotelID, roomID, multiTourID, oneTourID, autorTourID]);

  return (
    <CenterBlock>
      <WidthBlock>
        <div className={`${classes.tour_slider} ${classes.feedback}`}>
          <div className={classes.tour_slider__block}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={30}
              className={`${classes.mySwiper} feedback`}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
            >
              {feedbacks.length > 0 ? (
                feedbacks.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className={classes.feedback_slide}>
                      <div className={classes.feedback_slide__top}>
                        <div className={classes.feedback_slide__top___img}>
                          <img src="/feedback_photo.webp" alt="Фото" />
                        </div>
                        <div className={classes.feedback_slide__top___name}>
                          {item.username || 'Аноним'}
                        </div>
                        <div className={classes.feedback_slide__top___stars}>
                          {Array.from({ length: item.rating || 5 }).map(
                            (_, i) => (
                              <img key={i} src="/starYellow.png" alt="★" />
                            )
                          )}
                        </div>
                      </div>
                      <div className={classes.feedback_slide__bottom}>
                        {item.text}
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className={classes.feedback_slide}>
                    Отзывов пока нет.
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </WidthBlock>
    </CenterBlock>
  );
}

export default Feedback;
