import React, { useEffect, useState } from 'react';
import classes from './Object.module.css';
import { Link, useNavigate } from 'react-router-dom';
import server from '../../../serverConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

function Object({
  isOpenNewPage,
  pageName,
  titleObject,
  regionData,
  width,
  inCart,
  setCartCount,
  handleOpen,
  open,
  isSimillar,
  regionName,
}) {
  if (regionData.visible === false) return null;

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }

  let pageNameVisit = '';

  if (regionData.days) {
    if (regionData.days.length > 1) {
      pageNameVisit = 'tours';
    }
    if (regionData.days.length <= 1) {
      pageNameVisit = 'excursions';
    }
  }

  function requestTypeNowToTab(requestType) {
    switch (requestType) {
      case 'getMultidayTours':
        return 'multidayTours';
      case 'getOnedayTours':
        return 'onedayTours';
      case 'getAuthorTours':
        return 'authorTours';
      case 'getHotels':
      case 'getRooms':
        return 'hotels';
      case 'getPlaces':
        return 'places';
      case 'getEvents':
        return 'events';
      default:
        return 'multidayTours';
    }
  }
  

  const token = localStorage.getItem('token');

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

  const [user, setUser] = useState(null);
  const [moreInfoText, setMoreInfoText] = useState(false);

  useEffect(() => {
    if (token) {
      getUserInfo(token)
        .then((userData) => setUser(userData))
        .catch((error) => console.error('Error initializing user:', error));
    }
  }, [token]);

  const navigate = useNavigate();

  const handleLikeClick = async () => {
    if (token) {
      const updates = {
        likes: [regionData._id],
      };

      try {
        const updatedUser = await updateUser(token, updates);
        setUser(updatedUser.user);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      alert('Вы не авторизованы');
      navigate('/signIn');
    }
  };
  const [isInCart, setIsInCart] = useState(false);

  const handleAddCartClick = async () => {
    if (token) {
      const updates = {
        cart: [regionData._id],
      };

      try {
        const updatedUser = await updateUser(token, updates);
        setUser(updatedUser);
        alert(updatedUser.message ? updatedUser.message : updatedUser);
        setIsInCart(true);
        setCartCount(updatedUser.user.cart.length);
        // window.location.reload();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      alert('Вы не авторизованы');
      navigate('/signIn');
    }
  };

  let photos = [];

  if (pageName == 'hotels') {
    photos = [
      regionData.mainPhoto,
      ...regionData.galery.filter((photo) => photo !== regionData.mainPhoto),
    ];
  } else {
    photos = [
      regionData.mainPhoto,
      ...regionData.photos.filter((photo) => photo !== regionData.mainPhoto),
    ];
  }

  function getStars(number) {
    let stars = '';
    for (let i = 0; i < number; i++) {
      stars += `<img src="/starYellow.png" alt="" />`;
    }

    return stars;
  }

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
    <div className={classes.objects_item} style={{ width: width }}>
      <div className={classes.objects_item__like} onClick={handleLikeClick}>
        {user && user.likes && user.likes.includes(regionData._id) ? (
          <img src="/userLike_full.png" alt="Liked" />
        ) : (
          <img src="/userLike_empty.png" alt="Not Liked" />
        )}
      </div>
      {regionData.optional && (
        <div className={classes.objects_item__moreInfo}>
          <img src="/optional_black.png" alt="Optional" />
          {regionData.optional}
        </div>
      )}
      {regionData.popular && (
        <div className={classes.objects_item__img_popular}>
          Популярное
          <img src="/Vector (2).png" alt="popular" />
        </div>
      )}

      <div className={classes.objects_item__img}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          loop={false}
          className="tourPhotos"
        >
          {photos.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={`${server}/refs/${item}`} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={classes.objects_item__bottom}>
        {titleObject !== 'title' ? (
          <>
            <div className={classes.objects_item_top_desc_info}>
              <div className={classes.objects_item__title}>
                {truncateString(regionData[titleObject], 50)}
              </div>
              <div className={classes.objects_item__desc}>
                <div>
                  Cпособ передвижения: <span>{regionData.travelMethod}</span>
                </div>
                <div>
                  Продолжительность: <span>{regionData.duration}</span>
                </div>
                <div>
                  Время отправления: <span>{regionData.departureTime}</span>
                </div>
                <div>
                  Тип экскурсии: <span>{regionData.tourType}</span>
                </div>
                <div>
                  Сложность: <span>{regionData.difficulty}</span>
                </div>
                {Number(regionData.min) !== 0 && (
                  <>
                    <div>
                      Минимальная стоимость: <span>{regionData.min} ₽</span>
                    </div>

                    <div>
                      Максимальная стоимость: <span>{regionData.max} ₽</span>
                    </div>
                  </>
                )}
              </div>
              {/* {regionData.optional &&
                                    <div className={classes.objects_item__optional}>
                                        <img src="/optional_black.png" alt="Optional" /> {regionData.optional}
                                    </div>
                                } */}
            </div>

            <div className={classes.objects_item_top_desc_info}>
              <div className={classes.objects_item__price}>
                <div>
                  Стоимость: <span>{extractAmount(regionData.cost)}</span>
                </div>
              </div>
              <div className={classes.buttons}>
                <button
                  className={classes.objects_item__button}
                  onClick={() => handleOpen(regionData._id, isSimillar)}
                >
                  Подробнее
                </button>

                {/*{(regionData.departureDates.length > 0 && regionData.departureDates[0] && regionData.typeOfBron && regionData.typeOfBron == 'Оплата на сайте') &&
                                        <Link to={`/${pageName ? pageName : pageNameVisit}/${regionData._id}#date`} className={classes.objects_item__button} >Забронировать</Link>
                                    }
                                    {(regionData.departureDates.length > 0 && regionData.departureDates[0] && regionData.typeOfBron && regionData.typeOfBron == 'Оставить заявку') &&
                                        <Link to={`/${pageName ? pageName : pageNameVisit}/${regionData._id}#date`} className={classes.objects_item__button} >Оставить заявку</Link>
                                    } */}
                {/* {regionData.departureDates.length > 0 &&
                                    <Link to={``} className={`${classes.objects_item__button} ${classes.objects_item__bron}`} onClick={handleAddCartClick}>
                                        {isInCart ? 'В корзине' : inCart}
                                    </Link>
                                } */}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={classes.objects_item__title}>
              {truncateString(regionData[titleObject], 50)}
              {regionData.stars && (
                <div
                  className={classes.objects_item__title_stars}
                  dangerouslySetInnerHTML={{
                    __html: getStars(regionData.stars),
                  }}
                ></div>
              )}
            </div>
            {regionData.city && (
              <div className={classes.objects_item__title_places}>
                <img src="/placePoint.webp" alt="" />
                {regionData.city}
              </div>
            )}
            {regionData.description && (
              <div className={classes.objects_item__title_desc}>
                {truncateString(regionData.description, 200)}
              </div>
            )}
            <div className={classes.buttons}>
             <button
                  className={classes.objects_item__button}
                  onClick={() => handleOpen(regionData._id, isSimillar)}
                >
                  Подробнее
                </button>
                </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Object;
