import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import classes from './Tours.module.css';

import CenterBlock from '../../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../../Standart/WidthBlock/WidthBlock';
import ToursTab from '../ToursTab/ToursTab';
import H2 from '../../Standart/H2/H2';

import Object from '../Object/Object';
import { jwtDecode } from 'jwt-decode';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Feedback from '../Feedback/Feedback';
import Slider from '../Slider/Slider';

import server from '../../../serverConfig';
import ReactModal from 'react-modal';
import CalendarTour from '../CalendarTour/CalendarTour';
import Add_Feedback from '../Add_Feedback/Add_Feedback';
import { Clapperboard } from 'lucide-react';

function Tours({
  children,
  requestType,
  pageName,
  tableName,
  similar,
  setCartCount,
  idToModal,
  handleOpen,
  open,
  regionName,
  ...props
}) {
  let { id } = useParams();

  const [tour, setTour] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  //Отзывы

  const feedbackTourId =
    requestType === 'getOneMultidayTour'
      ? { multiTourID: idToModal }
      : requestType === 'getOneOnedayTour'
      ? { oneTourID: idToModal }
      : requestType === 'getOneAuthorTour'
      ? { autorTourID: idToModal }
      : {};

  //Отзывы

  const fetchTour = () => {
    fetch(`${server}/api/${requestType}/${idToModal}`)
      .then((response) => response.json())
      .then((data) => setTour(data))
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchTour();
  }, [idToModal]);

  // console.log('1111', requestType);

  const [regions, setRegions] = useState([]);

  const fetchData = () => {
    fetch(`${server}/api/${similar}`)
      .then((response) => response.json())
      .then((data) => setRegions(data[tableName]))
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [places, setPlaces] = useState();

  const fetchPlaces = () => {
    fetch(`${server}/api/getPlaces`)
      .then((response) => response.json())
      .then((data) => setPlaces(data.places))
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const foundRegion = regions.filter(
    (region) => region.region === tour?.region
  );

  const renderPlaces = (item) => {
    if (!places || places.length === 0) {
      return <span key={item}>{item}</span>;
    }
    const normalizedItem = item.toLowerCase();
    const matchedPlace = places.find((place) =>
      place.title.toLowerCase().includes(normalizedItem)
    );
    return matchedPlace ? (
      <Link
        to={`/visits/${matchedPlace._id}`}
        key={matchedPlace._id}
        style={{
          textTransform: 'capitalize',
        }}
      >
        {item}
      </Link>
    ) : (
      <span key={normalizedItem}>{item}</span>
    );
  };

  const [regionsName, setRegionsName] = useState();

  const fetchRegionsName = () => {
    fetch(`${server}/api/getRegions`)
      .then((response) => response.json())
      .then((data) => setRegionsName(data.regions))
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchRegionsName();
  }, []);

  function getTitleByLink(regions, targetLink) {
    const region = regions.find((region) => region.link === targetLink);
    return region ? region.title : null;
  }

  let regionNameData = '';
  regionsName && tour
    ? (regionNameData = getTitleByLink(regionsName, tour.region))
    : null;

  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;

  useEffect(() => {
    getUserInfo(token)
      .then((userData) => setUser(userData))
      .catch((error) => console.error('Error initializing user:', error));
  }, [token]);

  const navigate = useNavigate();

  const getUserInfo = async (token) => {
    if (token) {
      try {
        const response = await fetch(`${server}/api/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      }
    }
  };

  const updateUser = async (token, updates) => {
    try {
      const response = await fetch(`${server}/api/userUpdate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update user.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const [isInCart, setIsInCart] = useState(false);

  const handleAddCartClick = async () => {
    if (token) {
      const updates = {
        cart: [idToModal],
      };

      try {
        const updatedUser = await updateUser(token, updates);
        setUser(updatedUser);
        alert(updatedUser.message ? updatedUser.message : updatedUser);
        setIsInCart(true);
        setCartCount(updatedUser.user.cart.length);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      alert('Вы не авторизованы');
      navigate('/signIn');
    }
  };

  const [activeTab, setActiveTab] = useState(null);

  const [currentDay, setCurrentDay] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const groupedByYearAndMonth =
    tour &&
    tour.departureDates.reduce((acc, range) => {
      const [start, end] = range.split(' - ');
      const startDate = new Date(start);
      const endDate = new Date(end);

      const year = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endMonth = endDate.getMonth() + 1;

      let found = acc.find(
        (item) => item.year === year && item.month === startMonth
      );

      if (found) {
        found.ranges.push(range);
      } else {
        acc.push({
          year: year,
          month: startMonth,
          ranges: [range],
        });
      }

      return acc;
    }, []);

  const filteredGroupedByYearAndMonth =
    tour &&
    groupedByYearAndMonth.filter((item) => {
      return (
        item.year > currentYear ||
        (item.year === currentYear && item.month >= currentMonth)
      );
    });

  const getMonthName = (month) => {
    const months = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    return months[month - 1];
  };

  function formatDateRange(dateRange) {
    if (dateRange == '') return '';

    const [startDate, endDate] = dateRange.split(' - ');

    const formatDate = (date) => {
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    };

    const formattedStartDate = formatDate(startDate);

    if (endDate) {
      const formattedEndDate = formatDate(endDate);
      return `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      return formattedStartDate;
    }
  }

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [tour]);

  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const placesTour = tour ? tour.places : [];

  const updatedPlaces = placesTour.flatMap((place) => [place, '']).slice(0, -1);

  const extractAmount = (input) => {
    if (!input) return null;

    const sanitizedInput = input
      .replace(/\s/g, '')
      .replace(/\.(?=\d{3})/g, '')
      .replace(/,/g, '.');

    const match = sanitizedInput.match(/\d+(\.\d+)?/);
    if (!match) return null;

    const amount = parseFloat(match[0]);

    return `${amount.toLocaleString('ru-RU')} ₽`;
  };
  return (
    <>
      {tour ? (
        <div className={classes.main}>
          <div
            className={classes.tour}
            style={{
              backgroundImage: `url('${server}/refs/${tour.mainPhoto}')`,
            }}
          >
            <CenterBlock>
              <WidthBlock>
                <div className={classes.centerPosition}>
                  {/* <div className={classes.tour_topInfo__bread}>
                                        <Link to={'/'}>Главная</Link> / <Link to={`/region/${tour.region}`}>{regionNameData}</Link> / {tour.tourTitle}
                                    </div> */}

                  <div className={classes.tour_topInfo__left___title}>
                    {tour.tourTitle}
                  </div>
                  <div className={classes.tour_topInfo}>
                    <div className={classes.tour_topInfo__left}>
                      <div className={classes.tour_topInfo__left___items}>
                        {tour.author && (
                          <div
                            className={
                              classes.tour_topInfo__left___items____elementAuthor
                            }
                          >
                            <div
                              className={
                                classes.tour_topInfo__left___items____element_____info
                              }
                            >
                              Автор тура: {tour.author}
                            </div>
                          </div>
                        )}

                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Cпособ передвижения:
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {tour.travelMethod}
                          </div>
                        </div>
                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Продолжительность:{' '}
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {tour.duration}
                          </div>
                        </div>
                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Время отправления:
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {tour.departureTime}
                          </div>
                        </div>
                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Тип экскурсии:
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {tour.tourType}
                          </div>
                        </div>
                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Сложность:
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {tour.difficulty}
                          </div>
                        </div>
                        <div
                          className={
                            classes.tour_topInfo__left___items____element
                          }
                        >
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____title
                            }
                          >
                            Стоимость:
                          </div>
                          <div
                            className={
                              classes.tour_topInfo__left___items____element_____info
                            }
                          >
                            {extractAmount(tour.cost)}
                          </div>
                        </div>
                      </div>

                      <a
                        className={classes.tour_topInfo__left___btn}
                        onClick={() => setIsModalOpen(true)}
                      >
                        Забронировать
                      </a>

                      {/* {(tour.departureDates.length > 0 && tour.departureDates[0] && tour.typeOfBron && tour.typeOfBron == 'Оставить заявку') &&
                                                <a className={classes.tour_topInfo__left___btn} href={'#date'}>
                                                    Оставить заявку
                                                </a>
                                            } */}
                      {/* <div className={classes.tour_topInfo__left___btn} onClick={handleAddCartClick}>
                                                {isInCart ? 'В корзине' : (user && user.cart && user.cart.includes(idToModal)) ? 'В корзине' : 'Добавить в корзину'}
                                            </div> */}
                    </div>
                    <div className={classes.tour_topInfo__right}>
                      <div className={classes.tour_topInfo__right___img}>
                        <Swiper
                          navigation={true}
                          pagination={{
                            clickable: true, // Делаем кружочки кликабельными
                            dynamicBullets: true, // Динамическое изменение размеров кружков
                          }}
                          modules={[Navigation, Pagination]}
                          loop={false}
                          className="tourPhotos"
                        >
                          {tour.photos.map((item, index) => (
                            // item != tour.mainPhoto ?
                            <SwiperSlide key={index}>
                              <img src={`${server}/refs/${item}`} alt="" />
                            </SwiperSlide>
                            // : null
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                  <div className={classes.tour_topInfo__left___title}>
                    Точки маршрута
                  </div>

                  <div className={classes.tour_topInfo__right___places}>
                    <Swiper
                      slidesPerView={7}
                      spaceBetween={0}
                      loop={false}
                      modules={[Pagination]}
                      className={'tourPointsSlider'}
                      pagination={{
                        clickable: true, // Делаем кружочки кликабельными
                        dynamicBullets: true, // Динамическое изменение размеров кружков
                      }}
                      breakpoints={{
                        320: {
                          slidesPerView: 2,
                        },
                        768: {
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 7,
                        },
                      }}
                    >
                      {updatedPlaces.map((item, index) => (
                        <SwiperSlide key={index}>
                          <div className={classes.tour_topInfo_withLine}>
                            {item != '' ? (
                              <div
                                className={
                                  classes.tour_topInfo__right___places____place
                                }
                              >
                                <div
                                  className={
                                    classes.tour_topInfo__right___places____place_____img
                                  }
                                >
                                  <svg
                                    width="17"
                                    height="22"
                                    viewBox="0 0 17 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8.49996 21.5C7.05646 20.2433 5.71847 18.8656 4.49998 17.3814C2.67142 15.1523 0.500001 11.8327 0.500001 8.66931C0.49838 5.36547 2.4477 2.38623 5.43834 1.12183C8.42898 -0.142565 11.8714 0.5571 14.1594 2.89434C15.6639 4.42306 16.5067 6.50255 16.5 8.66931C16.5 11.8327 14.3285 15.1523 12.4999 17.3814C11.2814 18.8656 9.94346 20.2433 8.49996 21.5ZM8.49996 5.17003C7.27506 5.17003 6.1432 5.83699 5.53075 6.91967C4.91829 8.00235 4.91829 9.33627 5.53075 10.419C6.1432 11.5016 7.27506 12.1686 8.49996 12.1686C10.3935 12.1686 11.9285 10.6019 11.9285 8.66931C11.9285 6.73671 10.3935 5.17003 8.49996 5.17003Z"
                                      fill="var(--black_color)"
                                    />
                                  </svg>
                                </div>
                                <div
                                  className={
                                    classes.tour_topInfo__right___places____place_____title
                                  }
                                >
                                  {renderPlaces(item)}
                                </div>
                              </div>
                            ) : (
                              <>
                                {index + 1 != updatedPlaces.length && (
                                  <div
                                    className={
                                      classes.tour_topInfo_withLine_option
                                    }
                                  >
                                    <div
                                      className={
                                        classes.tour_topInfo_withLine_option_num
                                      }
                                    >
                                      {(index + 1) / 2}
                                    </div>
                                    <img src="/line.png" alt="" />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </WidthBlock>
            </CenterBlock>
          </div>

          <WidthBlock>
            <CenterBlock>
              <div className={classes.title}>
              <H2 text_transform="uppercase" font_size="36px">
                Что взять с собой
              </H2>
              <H2 text_transform="uppercase" font_size="36px">
                Что входит в тур
              </H2>
              </div>
              
            </CenterBlock>

            <div className={classes.checkList}>
              <CenterBlock>
                <div className={classes.checkList_block}>
                <div className={classes.checkList_blockLeft}>
                  {tour.checklists.map((item, index) => (
                    <div className={classes.checkList_block_item} key={index}>
                      <img src="/checkmark-circle.png" alt="" /> {item}
                    </div>
                  ))}
                  </div>
                  <div className={classes.checkList_blockRight}>
                  {tour.entries?.map((item, index) => (
                    <div className={classes.checkList_block_item} key={index}>
                      <img src="/checkmark-circle.png" alt="" /> {item}
                    </div>
                  ))}
                  </div>
                </div>
              </CenterBlock>
            </div>

            <ToursTab tabs={tour.days} />

            {/* {(tour.departureDates.length > 0 && tour.departureDates[0]) &&
                            <div id="date" className={classes.docBlocks}>
                                <CenterBlock>
                                    <H2 text_transform="uppercase" font_size="36px">Даты и наличие мест</H2>
                                </CenterBlock>

                                <div className={classes.tabs}>
                                    {groupedByYearAndMonth.map((item, index) => (
                                        <button
                                            key={index}
                                            className={item.year === currentYear && item.month === currentMonth ? classes.activeTab : ''}
                                            onClick={() => {
                                                setActiveTab(item.month);
                                                setCurrentYear(item.year);
                                                setCurrentMonth(item.month);
                                            }}
                                        >
                                            {getMonthName(item.month)} {item.year}
                                        </button>
                                    ))}
                                </div>

                                <div className={classes.departureDates}>
                                    <div className={classes.departureDates_line}>
                                        <div className={classes.departureDates_line_column}>Дата проведения</div>
                                        <div className={classes.departureDates_line_column}>Продолжительность</div>
                                        <div className={classes.departureDates_line_column}>Время отправления</div>
                                        <div className={classes.departureDates_line_column}>Стоимость</div>
                                        <div className={classes.departureDates_line_column}></div>
                                    </div>

                                    {filteredGroupedByYearAndMonth
                                        .filter(item => item.year === currentYear && item.month === currentMonth)
                                        .map((item, index) => (
                                            item.ranges.map((range, rangeIndex) => {
                                                const [start, end] = range.split(' - ');

                                                if (currentDay > end) {
                                                    return
                                                }
                                                const duration = tour.duration;
                                                const departureTime = tour.departureTime;
                                                const cost = tour.cost;

                                                return (
                                                    <div className={classes.departureDates_line} key={`${index}-${rangeIndex}`}>
                                                        <div className={classes.departureDates_line_column}>{`${formatDateRange(start)} - ${formatDateRange(end)}`}</div>
                                                        <div className={classes.departureDates_line_column}>{duration}</div>
                                                        <div className={classes.departureDates_line_column}>{departureTime}</div>
                                                        <div className={classes.departureDates_line_column}>{cost}</div>
                                                        <div className={classes.departureDates_line_column}>
                                                            <div className={classes.departureDates_line_column_btn} onClick={() => openModal(range)}>
                                                                {(tour.typeOfBron && tour.typeOfBron == 'Оплата на сайте') && 'Забронировать'}
                                                                {(tour.typeOfBron && tour.typeOfBron == 'Оставить заявку') && 'Оставить заявку'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ))}
                                </div>
                            </div>
                        } */}

            <ReactModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              contentLabel="Booking Modal"
              ariaHideApp={false}
              className={classes.modal}
              overlayClassName={classes.overlay}
            >
              <CalendarTour
                closeModal={closeModal}
                tour={tour}
                onChange={setSelectedDate}
                selectedDate={selectedDate}
              />
              <button onClick={closeModal} className={classes.modalCloseButton}>
                &#x2715;
              </button>
            </ReactModal>

            <CenterBlock>
              <H2 text_transform="uppercase" font_size="36px">
                ОТЗЫВЫ
              </H2>
            </CenterBlock>

            {/* {user && tour && (
              <Add_Feedback userID={user._id} tourId={tour._id} />
            )} */}

            {user && tour && (
              <Add_Feedback userID={user._id} {...feedbackTourId} />
            )}

            <Feedback {...feedbackTourId} />

            {foundRegion.length > 1 ? (
              <>
                <CenterBlock>
                  <H2 text_transform="uppercase" font_size="36px">
                    Похожие туры
                  </H2>
                </CenterBlock>

                <div className={classes.similar}>
                  <div className={classes.similarBlock}>
                    <Swiper
                      navigation={true}
                      modules={[Navigation]}
                      slidesPerView={2}
                      spaceBetween={30}
                      className={'similarTours'}
                      breakpoints={{
                        320: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 2,
                        },
                      }}
                    >
                      {foundRegion.map((item, index) =>
                        item._id != idToModal ? (
                          <SwiperSlide key={index}>
                            <Object
                              regionName={regionName}
                              handleOpen={handleOpen}
                              isSimillar={true}
                              open={open}
                              width={'100%'}
                              regionData={item}
                              titleObject={'tourTitle'}
                              pageName={pageName}
                              inCart={
                                user && user.cart.includes(item._id)
                                  ? 'В корзине'
                                  : 'Добавить в корзину'
                              }
                            />
                          </SwiperSlide>
                        ) : null
                      )}
                    </Swiper>
                  </div>
                </div>
              </>
            ) : null}
          </WidthBlock>
        </div>
      ) : null}
    </>
  );
}

export default Tours;
