import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './AdminPageNew.module.css';

import { Eye, EyeOff } from 'lucide-react';

import server from '../../serverConfig';

import AddRegion from './Blocks/AdminTabsComponents/AddRegion/AddRegion';
import AddAboutCompany from './Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany';
import AddOurTeam from './Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam';
import AddOurMission from './Blocks/AdminTabsComponents/AddOurMission/AddOurMission';
import AddTransfer from './Blocks/AdminTabsComponents/AddTransfer/AddTransfer';
import AddFAQ from './Blocks/AdminTabsComponents/AddFAQ/AddFAQ';
import AddContacts from './Blocks/AdminTabsComponents/AddContacts/AddContacts';
import AddTuragent from './Blocks/AdminTabsComponents/AddTuragent/AddTuragent';
import EditRegion from './Blocks/AdminTabsComponents/EditRegion/EditRegion';
import CenterBlock from '../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../Standart/WidthBlock/WidthBlock';
import Gids from './Blocks/AdminTabsComponents/Gids/Gids';
import ModeredAuthorTours from './Blocks/AdminTabsComponents/ModeredAuthorTours/ModeredAuthorTours';
import AddAgent from './Blocks/AdminTabsComponents/AddAgent/AddAgent';
import Brons from './Blocks/AdminTabsComponents/Brons/Brons';
import AddUsers from './Blocks/AdminTabsComponents/AddUsers/AddUsers';
import AddHotelAndApartments from './Blocks/AdminTabsComponents/AddHotelAndApartments/AddHotelAndApartments';
import AdminReviews from './Blocks/AdminTabsComponents/AdminReviews/AdminReviews';

const ItemType = {
  REGION: 'region',
};

function DraggableRegion({
  region,
  index,
  moveRegion,
  activeTab,
  deleteElement,
  setActiveTab,
  role,
  setRegions,
}) {
  const navigate = useNavigate();
  const { title } = useParams();

  const [, ref] = useDrag({
    type: ItemType.REGION,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.REGION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRegion(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const isActive = title === region.link ? classes.boldText : '';

  // 🆕 Toggle visibility
  const toggleVisibility = async () => {
    try {
      const response = await fetch(`${server}/api/updateRegion/${region._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visible: !region.visible,
        }),
      });

      const data = await response.json();
      if (data) {
        setRegions((prev) =>
          prev.map((r) =>
            r._id === region._id ? { ...r, visible: !region.visible } : r
          )
        );
      } else {
        console.error('Ошибка: ', data.message);
      }
    } catch (error) {
      console.error('Ошибка при изменении видимости:', error);
    }
  };

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`${classes.elemBlock} ${isActive}`}
    >
      <span
        className={classes.admin_data__nav___item____subItem}
        onClick={() => {
          setActiveTab(`editRegion-${region.link}`);
          navigate(`/admin/edit/${region.link}`);
        }}
        style={{ cursor: 'pointer' }}
      >
        {region.title}
      </span>

      {/* 👁️ Глаз */}
      <span
        onClick={toggleVisibility}
        style={{
          cursor: 'pointer',
          marginLeft: '5px',
          display: 'inline-flex',
          marginRight: '5px',
        }}
        title={region.visible ? 'Скрыть регион' : 'Показать регион'}
        aria-label={region.visible ? 'Регион виден' : 'Регион скрыт'}
      >
        {region.visible ? (
          <Eye size={20} color="green" />
        ) : (
          <EyeOff size={20} color="gray" />
        )}
      </span>

      {/* 🗑️ Удалить */}
      {role === 'admin' && (
        <img
          src="/delete_region.webp"
          alt="Удалить"
          onClick={() => deleteElement(region._id)}
        />
      )}
    </div>
  );
}

function AdminPageNew({ children, ...props }) {
  const { id = '', title } = useParams(); // Теперь id всегда строка

  // Храним состояние открытых секций

  useEffect(() => {
    if (id) {
      setActiveTab(id);

      if (id === 'editRegion') {
        setOpenSection('regions');
      } else if (id === 'adminReviews') {
        setOpenSection('adminReviews'); // 👉 можно даже просто setOpenSection('') если секция не вложенная
      }
    }
  }, [id]);

  // useEffect(() => {
  //   setActiveTab(id); // Устанавливаем активный таб сразу при изменении id
  //   if (id === 'editRegion') {
  //     setOpenSection('regions'); // Устанавливаем секцию для редактирования
  //   }
  // }, [id]); // Следим за изменением id

  const [openSections, setOpenSections] = useState(() => {
    const savedSections = localStorage.getItem('openSections');
    return savedSections
      ? JSON.parse(savedSections)
      : {
          pages: false,
          brons: false,
          regions: false,
          about: false,
          moderedAuthorTours: false,
        };
  });

  // Функция для переключения секций с сохранением в локальное хранилище
  // const toggleSection = (section) => {
  //   setOpenSections((prev) => {
  //     const updatedSections = {
  //       pages: section === 'pages' ? !prev.pages : prev.pages,
  //       brons: section === 'brons' ? !prev.brons : prev.brons,
  //       regions: section === 'regions' ? !prev.regions : prev.regions,
  //       about: section === 'about' ? !prev.about : prev.about,
  //     };
  //     localStorage.setItem('openSections', JSON.stringify(updatedSections)); // Сохраняем в локальное хранилище
  //     return updatedSections;
  //   });
  // };

  useEffect(() => {
    localStorage.setItem('openSections', JSON.stringify(openSections));
  }, [openSections]);

  // const [openSections, setOpenSections] = useState({
  //   pages: false,
  //   brons: false,
  // });

  // // Функция для переключения секций
  const toggleSection = (section) => {
    setOpenSections((prev) => {
      // Если кликнули на основную секцию (pages, brons), закрываем остальные основные
      if (section === 'pages' || section === 'brons') {
        return {
          pages: section === 'pages' ? !prev.pages : false,
          brons: section === 'brons' ? !prev.brons : false,
          regions: false,
          about: false,
        };
      }

      // Если кликнули на вложенную секцию, оставляем главную открытой
      return {
        ...prev,
        [section]: !prev[section],
      };
    });
  };

  let block = id;
  let boldName = id;

  let section = '';

  if (title) {
    boldName = title;
    block = 'editRegion';
    section = 'regions';
  }

  if (block === 'Region') {
    section = 'regions';
  }

  if (block === 'adminReviews') {
    section = 'adminReviews';
  }

  if (block === 'addRegion') {
    section = 'regions';
  }
  if (
    block === 'addAboutCompany' ||
    block === 'addOurTeam' ||
    block === 'addOurMission'
  ) {
    section = 'about';
  }

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return id || savedTab || 'addUsers';
  });

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  // const [activeTab, setActiveTab] = useState(block);
  const [openSection, setOpenSection] = useState(section);
  const [regions, setRegions] = useState([]);

  const fetchRegions = () => {
    fetch(`${server}/api/getRegions`)
      .then((response) => response.json())
      .then((data) => {
        const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
        setRegions(sortedRegions);
      })
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const isActive = (sectionName) =>
    boldName === sectionName ? `${classes.boldText}` : '';
  const isActiveEdit = (sectionName) =>
    id === sectionName ? `${classes.boldText}` : '';

  async function handleFormSuccess() {
    try {
      const response = await fetch(`${server}/api/getRegions`);
      const data = await response.json();
      setRegions(data.regions);
    } catch (error) {
      console.error('Error fetching Region info:', error);
    }
  }

  const deleteElement = async (id) => {
    if (confirm('Вы уверены, что хотите удалить регион?')) {
      try {
        await fetch(`${server}/api/deleteRegion/${id}`, {
          method: 'DELETE',
        });
        setRegions((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );
      } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
      }

      handleFormSuccess();
    }
  };

  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Закрытие при клике вне блока
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [user, setUser] = useState();

  let token = localStorage.getItem('token');

  const navigate = useNavigate();

  const getUserInfo = async (token) => {
    const response = await fetch(`${server}/api/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    } else {
      localStorage.removeItem('token');
      console.error('Ошибка получения информации о пользователе');
    }
  };

  useEffect(() => {
    if (token) {
      getUserInfo(token);
    } else {
      navigate('/profile');
    }
  }, [token]);

  useEffect(() => {
    if (
      user &&
      user.adminPanelAccess == false &&
      (user.role !== 'admin' || user.role !== 'touragent')
    ) {
      navigate('/profile');
    }
  }, [user]);

  const moveRegion = (fromIndex, toIndex) => {
    const updatedRegions = [...regions];
    const [movedRegion] = updatedRegions.splice(fromIndex, 1);
    updatedRegions.splice(toIndex, 0, movedRegion);
    setRegions(updatedRegions);
  };

  useEffect(() => {
    const saveOrder = async () => {
      try {
        await fetch(`${server}/api/saveRegionsOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ regions }),
        });
      } catch (error) {
        console.error('Ошибка при сохранении порядка регионов:', error);
      }
    };

    if (regions.length > 0) {
      saveOrder();
    }
  }, [regions]);

  const [touragents, setTouragents] = useState([]);

  useEffect(() => {
    async function fetchTouragents() {
      try {
        const response = await fetch(`${server}/api/getTouragents`);
        const data = await response.json();
        const filteredTouragents = data.users.filter(
          (agent) => !agent.adminPanelAccess
        );
        setTouragents(filteredTouragents);
      } catch (error) {
        console.error('Error fetching mission info:', error);
      }
    }
    fetchTouragents();
  }, []);

  const [brons, setBrons] = useState([]);
  const [unconfirmedHotelCount, setUnconfirmedHotelCount] = useState(0);

  useEffect(() => {
    async function fetchBrons() {
      try {
        const response = await fetch(`${server}/api/getAgents`);
        const data = await response.json();
        const filteredBrons = data.agent.filter((agent) => !agent.confirm);
        setBrons(filteredBrons);
      } catch (error) {
        console.error('Error fetching mission info:', error);
      }
    }
    fetchBrons();
  }, []);

  useEffect(() => {
    async function fetchHotelBrons() {
      try {
        const response = await fetch(`${server}/api/getHotelBrons`);
        const data = await response.json();
        const unconfirmed = data.hotelBron.filter((bron) => !bron.confirm);
        setUnconfirmedHotelCount(unconfirmed.length);
      } catch (error) {
        console.error('Ошибка при загрузке броней отелей:', error);
      }
    }

    fetchHotelBrons();
  }, []);

  const [tours, setTours] = useState([]);
  const [unmoderatedTourCount, setUnmoderatedTourCount] = useState(0);

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch(`${server}/api/getAuthorTours`);
        const data = await response.json();
        setTours(data.authorTour);
        const unmoderatedCount = data.authorTour.filter(
          (tour) => tour.modered === 'false' && tour.comment == ''
        ).length;
        setUnmoderatedTourCount(unmoderatedCount);
      } catch (error) {
        console.error('Error fetching mission info:', error);
      }
    }

    fetchTours();
  }, []);

  useEffect(() => {
    if (id.startsWith('edit')) {
      setActiveTab(`editRegion-${id.replace('edit/', '')}`);
      setOpenSections((prev) => ({
        ...prev,
        regions: true,
      }));
    }
  }, [id]);

  // Трансфер

  const [transferRequests, setTransferRequests] = useState([]);
  const [hiddenTransferCount, setHiddenTransferCount] = useState(0);

  const fetchTransferRequests = async () => {
    try {
      const res = await fetch(`${server}/api/transfer`);
      const data = await res.json();
      setTransferRequests(data);

      const hidden = data.filter((req) => req.status === false);
      setHiddenTransferCount(hidden.length);
    } catch (error) {
      console.error('Ошибка при получении заявок на трансфер:', error);
    }
  };

  useEffect(() => {
    fetchTransferRequests();
  }, []);

  // Трансфер

  //Брони
  const fetchBronsData = async () => {
    try {
      const [agentsRes, hotelsRes] = await Promise.all([
        fetch(`${server}/api/getAgents`),
        fetch(`${server}/api/getHotelBrons`),
      ]);

      const agentsData = await agentsRes.json();
      const hotelsData = await hotelsRes.json();

      const filteredBrons = agentsData.agent.filter((agent) => !agent.confirm);
      const unconfirmedHotels = hotelsData.hotelBron.filter(
        (bron) => !bron.confirm
      );

      setBrons(filteredBrons);
      setUnconfirmedHotelCount(unconfirmedHotels.length);
    } catch (error) {
      console.error('Ошибка при загрузке броней:', error);
    }
  };

  useEffect(() => {
    fetchBronsData();
  }, []);

  //Брони

  // Отзывы

  const [reviews, setReviews] = useState([]);
  const [hiddenReviewCount, setHiddenReviewCount] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${server}/api/getReview`);
      const data = await response.json();
      setReviews(data.reviews || []);
      const hidden = (data.reviews || []).filter(
        (review) => review.visible === false
      );
      setHiddenReviewCount(hidden.length);
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Отзывы

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/signIn');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {user &&
      user.role &&
      user.adminPanelAccess &&
      (user.role === 'admin' || user.role === 'touragent') ? (
        <div className={classes.admin}>
          <div className={classes.admin_data}>
            <div className={classes.admin_data__nav}>
              <a
                href="/"
                target="_blank"
                className={classes.admin_data_nav_logo}
              >
                <img src="/about_title_logo.webp" alt="" />
              </a>

              <Link
                to={`/admin/addUsers`}
                className={`${classes.nav_title} ${
                  activeTab === 'addUsers' ? classes.boldText : ''
                }`}
                onClick={() => {
                  setActiveTab('addUsers');
                  setOpenSection('addUsers');
                }}
              >
                Пользователи
              </Link>

              {/* Страницы */}
              <div
                className={`${classes.nav_title} ${
                  openSections.pages ? classes.boldText : ''
                }`}
                onClick={() => toggleSection('pages')}
              >
                Страницы
                <span style={{ color: 'red' }}>({hiddenTransferCount})</span>
              </div>

              {openSections.pages && (
                <div className={classes.admin_data__nav___item1}>
                  {/* Регион */}
                  <div
                    className={`${classes.hoverBlock} ${
                      openSections.regions ? classes.activeLink : ''
                    }`}
                    onClick={() => toggleSection('regions')}
                  >
                    Регион
                  </div>
                  {openSections.regions && (
                    <div className={classes.admin_data__nav___item____desc}>
                      {user.role === 'admin' && (
                        <Link
                          to={'/admin/addRegion'}
                          className={`${
                            classes.admin_data__nav___item____subItem
                          } ${
                            activeTab === 'addRegion' ? classes.activeLink : ''
                          }`}
                          onClick={() => setActiveTab('addRegion')}
                        >
                          + Добавить регион
                        </Link>
                      )}

                      {regions.map((region, index) => (
                        <DraggableRegion
                          key={region._id}
                          region={region}
                          index={index}
                          moveRegion={moveRegion}
                          deleteElement={deleteElement}
                          setActiveTab={setActiveTab}
                          role={user.role}
                          setRegions={setRegions} // ✅ Добавили
                        />
                      ))}
                    </div>
                  )}

                  {/* О нас */}
                  <div
                    className={`${classes.hoverBlock} ${
                      openSections.about ? classes.activeLink : ''
                    }`}
                    onClick={() => toggleSection('about')}
                  >
                    О нас
                  </div>
                  {openSections.about && (
                    <div className={classes.admin_data__nav___item____desc}>
                      <Link
                        to="/admin/addAboutCompany"
                        className={`${
                          classes.admin_data__nav___item____subItem
                        } ${
                          activeTab === 'addAboutCompany'
                            ? classes.activeLink
                            : ''
                        }`}
                        onClick={() => setActiveTab('addAboutCompany')}
                      >
                        О компании
                      </Link>
                      <Link
                        to="/admin/addOurTeam"
                        className={`${
                          classes.admin_data__nav___item____subItem
                        } ${
                          activeTab === 'addOurTeam' ? classes.activeLink : ''
                        }`}
                        onClick={() => setActiveTab('addOurTeam')}
                      >
                        Наша команда
                      </Link>
                      <Link
                        to="/admin/addOurMission"
                        className={`${
                          classes.admin_data__nav___item____subItem
                        } ${
                          activeTab === 'addOurMission'
                            ? classes.activeLink
                            : ''
                        }`}
                        onClick={() => setActiveTab('addOurMission')}
                      >
                        Наша миссия
                      </Link>
                    </div>
                  )}

                  {/* Трансфер */}
                  <Link
                    to={`/admin/addTransfer`}
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'addTransfer' ? classes.activeLink : ''
                    } ${classes.hoverBlock}`}
                    onClick={() => setActiveTab('addTransfer')}
                  >
                    Трансфер{' '}
                    {hiddenTransferCount > 0 && (
                      <span style={{ color: 'red' }}>
                        ({hiddenTransferCount})
                      </span>
                    )}
                  </Link>

                  {/* FAQ */}
                  <Link
                    to={`/admin/addFAQ`}
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'addFAQ' ? classes.activeLink : ''
                    } ${classes.hoverBlock}`}
                    onClick={() => setActiveTab('addFAQ')}
                  >
                    FAQ
                  </Link>

                  {/* Контакты */}
                  <Link
                    to={`/admin/addContacts`}
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'addContacts' ? classes.activeLink : ''
                    } ${classes.hoverBlock}`}
                    onClick={() => setActiveTab('addContacts')}
                  >
                    Контакты
                  </Link>

                  {/* Турагентам */}
                  <Link
                    to={`/admin/addTuragent`}
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'addTuragent' ? classes.activeLink : ''
                    } ${classes.hoverBlock}`}
                    onClick={() => setActiveTab('addTuragent')}
                  >
                    Турагентам
                  </Link>
                </div>
              )}

              {/* Брони */}

              <div
                className={`${classes.nav_title} ${
                  openSections.brons ? classes.boldText : ''
                }`}
                onClick={() => toggleSection('brons')}
              >
                Брони
                <span style={{ color: 'red' }}>
                  ({brons.length + unconfirmedHotelCount})
                </span>
              </div>
              {openSections.brons && (
                <div className={classes.admin_data__nav___item1}>
                  <Link
                    to="/admin/brons"
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'brons' ? classes.activeLink : ''
                    }`}
                    onClick={() => setActiveTab('brons')}
                  >
                    Брони туров{' '}
                    {brons.length > 0 && (
                      <span style={{ color: 'red' }}>({brons.length})</span>
                    )}
                  </Link>

                  <Link
                    to="/admin/addHotelAndApartments"
                    className={`${classes.admin_data__nav___item} ${
                      activeTab === 'addHotelAndApartments'
                        ? classes.activeLink
                        : ''
                    }`}
                    onClick={() => setActiveTab('addHotelAndApartments')}
                  >
                    Брони отелей{' '}
                    {unconfirmedHotelCount > 0 && (
                      <span style={{ color: 'red' }}>
                        ({unconfirmedHotelCount})
                      </span>
                    )}
                  </Link>
                </div>
              )}

              <Link
                to="/admin/moderedAuthorTours"
                className={`${classes.nav_title} ${
                  activeTab === 'moderedAuthorTours' ? classes.boldText : ''
                }`}
                onClick={() => setActiveTab('moderedAuthorTours')}
              >
                Неподтвержденные туры
              </Link>

              <Link
                to="/admin/adminReviews"
                className={`${classes.nav_title} ${
                  activeTab === 'adminReviews' ? classes.boldText : ''
                }`}
                onClick={() => setActiveTab('adminReviews')}
              >
                Отзывы{' '}
                {hiddenReviewCount > 0 && (
                  <span style={{ color: 'red' }}>({hiddenReviewCount})</span>
                )}
              </Link>

              <a
                href="/"
                target="_blank"
                className={classes.admin_data_nav_home}
              >
                <span className={classes.nav_title}>Перейти на сайт</span>
              </a>
            </div>
            <div className={classes.admin_data__info}>
              <div className={classes.admin_data__info_top}>
                <span className={classes.admin_data__info_top_date}>
                  {new Date().toLocaleDateString('ru-RU', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
                <div
                  style={{ position: 'relative', display: 'inline-block' }}
                  ref={ref}
                >
                  {/* Основной блок пользователя */}
                  <span
                    className={classes.admin_data__info_top_user}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src="/logo_about.png"
                      alt="User"
                      style={{ marginRight: 8 }}
                    />
                    <span>
                      {user ? (
                        <>
                          <span>{user.name}</span> <span>({user.role})</span>
                        </>
                      ) : (
                        'Загрузка...'
                      )}
                    </span>
                  </span>

                  {/* Выпадающее меню */}
                  {isOpen && (
                    <div className={classes.adminWindow} style={{}}>
                      <button onClick={logout}>
                        <img src="/logoutAdmin.png" /> Выйти
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Добавить регион */}
              {activeTab === 'addRegion' && (
                <AddRegion fetchRegions={fetchRegions} />
              )}

              {/* Редактировать регион */}
              {activeTab.startsWith('editRegion') && (
                <EditRegion
                  regionId={activeTab.replace('editRegion-', '')} // Передаем ID региона
                  role={user.role}
                  userName={user.name}
                  userID={user._id}
                />
              )}

              {/* Редактировать авторов туров */}
              {activeTab === 'brons' && (
                <Brons fetchBronsData={fetchBronsData} />
              )}

              {activeTab === 'touragents' && <Gids />}
              {activeTab === 'moderedAuthorTours' && <ModeredAuthorTours />}

              {/* Добавить О нас */}
              {activeTab === 'addAboutCompany' && <AddAboutCompany />}
              {activeTab === 'addOurTeam' && <AddOurTeam />}
              {activeTab === 'addOurMission' && <AddOurMission />}

              {/* Добавить Транфер */}
              {activeTab === 'addTransfer' && (
                <AddTransfer
                  transferRequests={transferRequests}
                  fetchTransferRequests={fetchTransferRequests}
                />
              )}

              {/* Добавить FAQ */}
              {activeTab === 'addFAQ' && <AddFAQ />}

              {/* Добавить Контакты */}
              {activeTab === 'addContacts' && <AddContacts />}

              {/* Добавить автора туров */}
              {activeTab === 'addTuragent' && <AddTuragent />}

              {/* Добавить Представителей */}
              {activeTab === 'addAgent' && (
                <AddAgent setActiveTab={setActiveTab} />
              )}
              {activeTab === 'addUsers' && (
                <AddUsers setActiveTab={setActiveTab} />
              )}
              {activeTab === 'addHotelAndApartments' && (
                <AddHotelAndApartments setActiveTab={setActiveTab} />
              )}
              {activeTab === 'adminReviews' && (
                <AdminReviews fetchReviews={fetchReviews} />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DndProvider>
  );
}

export default AdminPageNew;
