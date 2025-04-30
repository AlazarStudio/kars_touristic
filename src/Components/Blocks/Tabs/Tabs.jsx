import React, { useState, useEffect } from 'react';
import classes from './Tabs.module.css';
import Object from '../Object/Object';
import Filter from '../Filter/Filter';
import FilterHotels from '../FilterHotels/FilterHotels';
import FilterPlaces from '../FilterPlaces/FilterPlaces';
import H2 from '../../Standart/H2/H2';
import CenterBlock from '../../Standart/CenterBlock/CenterBlock';

import { Modal, Box, Button, Slide } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import server from '../../../serverConfig';
import Tours_Page from '../../Pages/Tours_Page';
import Hotels_Page from '../../Pages/Hotels_Page';
import zIndex from '@mui/material/styles/zIndex';
import LazyLoadTours from '../../Pages/LazyLoadTours';
import { useNavigate, useParams } from 'react-router-dom';
import Number_Page from '../../Pages/Number_Page';
import Visit_Page from '../../Pages/Visit_Page';
import Event_Page from '../../Pages/Event_Page';

function Tabs({
  children,
  setActiveTab,
  regionName,
  requestType,
  tableName,
  pageName,
  titleObject,
  checkModered,
  setCartCount,
  idTour,
  idRoom,
  ...props
}) {
  const [objects, setObjects] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const { id, tab = 'multidayTours',   } = useParams();

  const [requestTypeNow, setRequestTypeNow] = useState(requestType);

  const fetchData = () => {
    fetch(`${server}/api/${requestTypeNow}`)
      .then((response) => response.json())
      .then((data) => {
        let sortedTours = data[tableName].sort((a, b) => a.order - b.order);
        if (checkModered) {
          sortedTours = sortedTours.filter((tour) => tour.modered !== 'false');
        }
        setObjects(sortedTours);
        setFilteredObjects(sortedTours); // Изначально все объекты доступны
      })
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const foundData = filteredObjects ? filteredObjects.filter(filteredObject => filteredObject.region === regionName) : [];
  const foundData = filteredObjects
    ? filteredObjects
        .filter((obj) => obj.region === regionName)
        .sort((a, b) => {
          if (a.popular === b.popular) return 0;
          return a.popular ? -1 : 1;
        })
    : [];

  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');
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

  useEffect(() => {
    if (token) {
      getUserInfo(token)
        .then((userData) => setUser(userData))
        .catch((error) => console.error('Error initializing user:', error));
    }
  }, [token]);

  const style = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    bgcolor: '#fff',
    boxShadow: 24,
    outline: 'none',
    zIndex: '9999999',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    // borderRadius: '30px 30px 0 0'
  };

  const [open, setOpen] = useState(false);
  const [idToModal, setIdToModal] = useState(false);

  const requestTypeNowToTab = (requestType) => {
    switch (requestType) {
      case 'getMultidayTours': return 'multidayTours';
      case 'getOnedayTours': return 'onedayTours';
      case 'getAuthorTours': return 'authorTours';
      case 'getHotels':
      case 'getRooms': return 'hotels';
      case 'getPlaces': return 'places';
      case 'getEvents': return 'events';
      default: return 'multidayTours';
    }
  };
  
  

  const handleOpen = (id, isSimillar) => {
    const tabName = requestTypeNowToTab(requestTypeNow);
    navigate(`/region/${regionName}/${tabName}/${id}`); // 👈 обновляем URL
  
    setOpen(true);
    setIdToModal(id);
  
    if (isSimillar) {
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
        setIdToModal(id);
      }, 300);
    }
  };
  
  

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  
    if (idRoom) {
      // Если закрываем номер — открыть отель
      navigate(`/region/${regionName}/hotels/${idTour}`);
      setRequestTypeNow('getHotels');
      setActiveTab('hotels');
      localStorage.setItem('activeTab', 'hotels');
  
      setTimeout(() => {
        setOpen(true);
        setIdToModal(idTour);
      }, 300);
    } else if (tab) {
      // Если есть таб, но нет idRoom
      navigate(`/region/${regionName}/${tab}`);
    } else {
      // Если вообще нет таба (очень редкий случай)
      navigate(`/region/${regionName}/multidayTours`);
    }
  };
  
  
  

  useEffect(() => {
    setOpen(false);
    if (idTour) {
      setTimeout(() => {
        setOpen(true);
        setIdToModal(idTour);
      }, 300);
    }
  }, [idTour]);

  let requestTypeOne;

  switch (requestTypeNow) {
    case 'getMultidayTours':
      requestTypeOne = 'getOneMultidayTour';
      break;
    case 'getOnedayTours':
      requestTypeOne = 'getOneOnedayTour';
      break;
    case 'getAuthorTours':
      requestTypeOne = 'getOneAuthorTours';
      break;
    case 'getHotels':
      requestTypeOne = 'getOneHotel';
      break;
    case 'getRooms':
      requestTypeOne = 'getOneRoom';
      break;
    case 'getPlaces':
      requestTypeOne = 'getOnePlace';
      break;
    case 'getEvents':
      requestTypeOne = 'getOneEvent';
      break;
    default:
      requestTypeOne = 'Страница не найдена';
      break;
  }

  useEffect(() => {
    if (!idTour) return;
  
    const checkTypesInOrder = async () => {
      const typesToCheck = [
        { type: 'getOneHotel', page: 'getHotels', tab: 'hotels' },
        { type: 'getOneRoom', page: 'getHotels', tab: 'hotels' },
        { type: 'getOnePlace', page: 'getPlaces', tab: 'places' },
        { type: 'getOneEvent', page: 'getEvents', tab: 'events' },
        { type: 'getOneMultidayTour', page: 'getMultidayTours', tab: 'multidayTours' },
        { type: 'getOneOnedayTour', page: 'getOnedayTours', tab: 'onedayTours' },
        { type: 'getOneAuthorTours', page: 'getAuthorTours', tab: 'authorTours' }
      ];
  
      for (const { type, page, tab } of typesToCheck) {
        try {
          const res = await fetch(`${server}/api/${type}/${idTour}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setRequestTypeNow(page);
              localStorage.setItem('activeTab', tab);
              setActiveTab(tab);
              break; // ⬅️ Прерываем цикл после первого совпадения
            }
          }
        } catch (e) {
          console.error(`Ошибка при проверке ${type}:`, e);
        }
      }
    };
  
    checkTypesInOrder();
  }, [idTour]);
  

  return (
    <>
      {foundData && (
        <div className={classes.fullBlock}>
          {objects.length > 0 ? (
            <>
              <CenterBlock>
                <H2 text_transform="uppercase">{props.title}</H2>
                {/* <span style={{ marginTop: '10px' }}>(Найдено: {foundData.length})</span> */}
              </CenterBlock>

              {requestTypeNow == 'getMultidayTours' && objects.length > 0 && (
                <Filter
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}
              {requestTypeNow == 'getOnedayTours' && objects.length > 0 && (
                <Filter
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}
              {requestTypeNow == 'getAuthorTours' && objects.length > 0 && (
                <Filter
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}
              {requestTypeNow == 'getHotels' && objects.length > 0 && (
                <FilterHotels
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}
              {requestTypeNow == 'getPlaces' && objects.length > 0 && (
                <FilterPlaces
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}
              {requestTypeNow == 'getEvents' && objects.length > 0 && (
                <FilterPlaces
                  objects={objects}
                  updateFilteredObjects={setFilteredObjects}
                />
              )}

              <div className={classes.objects}>
                <LazyLoadTours
                  regionName={regionName}
                  foundData={foundData}
                  itemsPerPage={6}
                  handleOpen={handleOpen}
                  isSimillar={false}
                  open={open}
                  setCartCount={setCartCount}
                  pageName={pageName}
                  titleObject={titleObject}
                  inCart={
                    user && user.cart.includes(idTour)
                      ? 'В корзине'
                      : 'Добавить в корзину'
                  }
                />

                {/* {
                                    foundData.map((item, index) => (
                                        <Object key={index} handleOpen={handleOpen} isSimillar={false} open={open} setCartCount={setCartCount} regionData={item} pageName={pageName} titleObject={titleObject} inCart={(user && user.cart.includes(item._id) ? 'В корзине' : 'Добавить в корзину')} />
                                    ))
                                } */}
              </div>
            </>
          ) : (
            <H2 text_transform="uppercase">Ничего не найдено</H2>
          )}
        </div>
      )}

      {open && (
        <IconButton
          onClick={() => handleClose()}
          aria-label="close"
          sx={{
            border: '1px solid #00000090',
            borderRadius: '50%',
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999999,
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#fff',
              border: '1px solid #00000090',
            },
          }}
        >
          <CloseIcon sx={{ color: '#00000090' }} />
        </IconButton>
      )}

<Modal
  open={open}
  onClose={handleClose}
  closeAfterTransition
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box sx={style}>
            {(requestTypeNow == 'getMultidayTours' ||
              requestTypeNow == 'getOnedayTours' ||
              requestTypeNow == 'getAuthorTours') && (
              <Tours_Page
                regionName={regionName}
                tableName={tableName}
                requestType={requestTypeOne}
                similar={requestTypeNow}
                pageName={'tours'}
                idToModal={idToModal}
                handleOpen={handleOpen}
                open={open}
              />
            )}
            {requestTypeNow == 'getHotels' && idTour && !idRoom && (
              <Hotels_Page
                user={user}
                setUser={setUser}
                handleOpen={handleOpen}
                isSimillar={false}
              />
            )}
            {requestTypeNow == 'getHotels' && idTour && idRoom && (
              <Number_Page user={user}  setUser={setUser}
              handleOpen={handleOpen}
              isSimillar={false} />
            )}

            {requestTypeNow == 'getPlaces' && idTour && (
              <Visit_Page user={user} />
            )}
            {requestTypeNow == 'getEvents' && idTour && (
              <Event_Page user={user} />
            )}
          </Box>
        </Slide>
      </Modal>
    </>
  );
}

export default Tabs;
