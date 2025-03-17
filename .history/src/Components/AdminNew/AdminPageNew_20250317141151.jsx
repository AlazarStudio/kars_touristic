import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './AdminPageNew.module.css';

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
}) {
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

  let activeShow = region.link === activeTab ? classes.boldText : '';
  // console.log(region.link);

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`${classes.elemBlock} ${activeShow}`}
    >
      <Link
        to={`/admin/edit/${region.link}`}
        className={classes.admin_data__nav___item____subItem}
        onClick={() => setActiveTab('editRegion')}
      >
        {region.title}
      </Link>
      {role === 'admin' ? (
        <img
          src="/delete_region.webp"
          alt=""
          onClick={() => deleteElement(region._id)}
        />
      ) : null}
    </div>
  );
}

function AdminPageNew({ children, ...props }) {
  const { id, title } = useParams();

  // Храним состояние открытых секций
  const [openSections, setOpenSections] = useState({
    pages: false,
    brons: false,
  });

  // Функция для переключения секций
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section], // Инвертируем текущее состояние
    }));
  };

  let block = id;
  let boldName = id;

  let section = '';

  if (title) {
    boldName = title;
    block = 'editRegion';
    section = 'regions';
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

  const [activeTab, setActiveTab] = useState(block);
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
  

  return (
    <DndProvider backend={HTML5Backend}>
      {user &&
      user.role &&
      user.adminPanelAccess &&
      (user.role === 'admin' || user.role === 'touragent') ? (
        <div className={classes.admin}>
          <div className={classes.admin_header}>
            {/* <a href="/" target="_blank" className={classes.admin_header__logo}>
                            <img src="/about_title_logo.webp" alt="" />
                        </a> */}
            <div className={classes.admin_header__items}>
              {user.role === 'admin' ? (
                <>
                  {/* <Link to={'/admin/brons'} className={classes.admin_header__items___item} onClick={() => setActiveTab('brons')}>
                                        Брони
                                        {
                                            brons && brons.length > 0 ?
                                                <div className={classes.admin_header__nonAccessData}>{brons.length}</div> :
                                                <div className={classes.admin_header__nonAccessData}>0</div>
                                        }
                                    </Link> */}

                  {/* <Link to={'/admin/touragents'} className={classes.admin_header__items___item} onClick={() => setActiveTab('touragents')}>
                                        Авторы туров
                                        {
                                            touragents && touragents.length > 0 ?
                                                <div className={classes.admin_header__nonAccessData}>{touragents.length}</div> :
                                                <div className={classes.admin_header__nonAccessData}>0</div>
                                        }
                                    </Link> */}

                  {/* <Link to={'/admin/moderedAuthorTours'} className={classes.admin_header__items___item} onClick={() => setActiveTab('moderedAuthorTours')}>
                                        Неподтвержденные туры
                                        {
                                            unmoderatedTourCount ?
                                                <div className={classes.admin_header__nonAccessData}>{unmoderatedTourCount}</div> :
                                                <div className={classes.admin_header__nonAccessData}>0</div>
                                        }
                                    </Link> */}
                  {/* <div className={classes.admin_header__items___item}>История заказов</div> */}
                </>
              ) : null}
              {/* <div className={classes.admin_header__items___item____dashboard}>
                                <img src="/admin-panel 1.webp" alt="" />
                                <Link to={'/profile'} target="_blank">{user.role === 'admin' ? 'Панель Администратора' : 'Панель Автора туров'}</Link>
                            </div> */}
            </div>
          </div>

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
                className={`${classes.admin_data__nav___item} ${isActive(
                  'addUsers'
                )} ${classes.nav_title}`}
                onClick={() => {
                  setActiveTab('addUsers');
                  setOpenSection('addUsers');
                }}
              >
                Пользователи
              </Link>

              {/* Страницы */}
              <div
                className={classes.nav_title}
                onClick={() => toggleSection('pages')}
              >
                Страницы
              </div>
              {openSections.pages && (
                <div className={classes.admin_data__nav___item1}>
                  {/* Регион */}
                  <div
                    className={classes.hoverBlock}
                    onClick={() => toggleSection('regions')}
                  >
                    Регион
                  </div>
                  {openSections.regions && (
                    <div className={classes.admin_data__nav___item____desc}>
                      {user.role === 'admin' && (
                        <Link
                          to={'/admin/addRegion'}
                          className={classes.admin_data__nav___item____subItem}
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
                          activeTab={title}
                          setActiveTab={setActiveTab}
                          role={user.role}
                        />
                      ))}
                    </div>
                  )}

                  {/* О нас */}
                  <div
                    className={classes.hoverBlock}
                    onClick={() => toggleSection('about')}
                  >
                    О нас
                  </div>
                  {openSections.about && (
                    <div className={classes.admin_data__nav___item____desc}>
                      <Link
                        to="/admin/addAboutCompany"
                        onClick={() => setActiveTab('addAboutCompany')}
                      >
                        О компании
                      </Link>
                      <Link
                        to="/admin/addOurTeam"
                        onClick={() => setActiveTab('addOurTeam')}
                      >
                        Наша команда
                      </Link>
                      <Link
                        to="/admin/addOurMission"
                        onClick={() => setActiveTab('addOurMission')}
                      >
                        Наша миссия
                      </Link>
                    </div>
                  )}

                  {/* Трансфер */}
                  <Link
                    to={`/admin/addTransfer`}
                    className={`${classes.admin_data__nav___item} ${isActive(
                      'addTransfer'
                    )} ${classes.hoverBlock}`}
                    onClick={() => {
                      setActiveTab('addTransfer');
                      setOpenSection('addTransfer');
                    }}
                  >
                    Трансфер
                  </Link>

                  {/* FAQ */}
                  <Link
                    to={`/admin/addFAQ`}
                    className={`${classes.admin_data__nav___item} ${isActive(
                      'addFAQ'
                    )} ${classes.hoverBlock}`}
                    onClick={() => {
                      setActiveTab('addFAQ');
                      setOpenSection('addFAQ');
                    }}
                  >
                    FAQ
                  </Link>

                  {/* Контакты */}
                  <Link
                    to={`/admin/addContacts`}
                    className={`${classes.admin_data__nav___item} ${isActive(
                      'addContacts'
                    )} ${classes.hoverBlock}`}
                    onClick={() => {
                      setActiveTab('addContacts');
                      setOpenSection('addContacts');
                    }}
                  >
                    Контакты
                  </Link>

                  {/* Турагентам */}
                  <Link
                    to={`/admin/addTuragent`}
                    className={`${classes.admin_data__nav___item} ${isActive(
                      'addTuragent'
                    )} ${classes.hoverBlock}`}
                    onClick={() => {
                      setActiveTab('addTuragent');
                      setOpenSection('addTuragent');
                    }}
                  >
                    Турагентам
                  </Link>
                </div>
              )}

     {/* Брони */}
<div className={classes.nav_title} onClick={() => toggleSection('brons')}>
    Брони
</div>
{openSections.brons && (
    <div className={classes.admin_data__nav___item1}>
        {/* Брони туров */}
        <Link
            to="/admin/brons"
            className={classes.admin_data__nav___item}
            onClick={() => setActiveTab('brons')}
        >
            Брони туров
        </Link>

        {/* Брони отелей */}
        <Link
            to="/admin/addHotelAndApartments"
            className={classes.admin_data__nav___item}
            onClick={() => setActiveTab('addHotelAndApartments')}
        >
            Брони отелей
        </Link>
    </div>
)}


              <Link
                to={'/admin/moderedAuthorTours'}
                className={classes.admin_header__items___item}
                onClick={() => setActiveTab('moderedAuthorTours')}
              >
                <span className={classes.nav_title}>Неподтвержденные туры</span>

                {/* {unmoderatedTourCount ? (
                      <div className={classes.admin_header__nonAccessData}>
                        {unmoderatedTourCount}
                      </div>
                    ) : (
                      <div className={classes.admin_header__nonAccessData}>
                        0
                      </div>
                    )} */}
              </Link>
              <a
                href="/"
                target="_blank"
                className={classes.admin_data_nav_home}
              >
                <span className={classes.nav_title}>Перейти на сайт</span>
              </a>
              {/* <Link to={`/admin/addAgent`}
                                        className={`${classes.admin_data__nav___item} ${isActive('addAgent')} ${classes.hoverBlock}`}
                                        onClick={() => { setActiveTab('addAgent'); setOpenSection('addAgent'); }}>
                                        Представители
                                    </Link> */}

              {/* <Link to={`/admin1/addUsers`}
                                        className={`${classes.admin_data__nav___item} ${isActive('addUsers')} ${classes.hoverBlock}`}
                                        onClick={() => { setActiveTab('addUsers'); setOpenSection('addUsers'); }}>
                                        Пользователи
                                    </Link> */}

              {/* <Link to={`/admin1/addHotelAndApartments`}
                                        className={`${classes.admin_data__nav___item} ${isActive('addHotelAndApartments')} ${classes.hoverBlock}`}
                                        onClick={() => { setActiveTab('addHotelAndApartments'); setOpenSection('addHotelAndApartments'); }}>
                                        Отели / Апартаменты
                                    </Link> */}
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
                <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
      {/* Основной блок пользователя */}
      <span
        className={classes.admin_data__info_top_user}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <img src="/logo_about.png" alt="User" style={{ marginRight: 8 }} />
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
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 8,
            padding: 12,
            minWidth: 200,
            zIndex: 10,
          }}
        >
          <p><strong>Имя:</strong> {user?.name}</p>
          <p><strong>Роль:</strong> {user?.role}</p>
          <button onClick={onLogout} style={{ background: 'red', color: 'white', padding: '8px 12px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Выйти
          </button>
        </div>
      )}
    </div>
                </span>
              </div>
              {/* Добавить регион */}
              {activeTab === 'addRegion' && (
                <AddRegion fetchRegions={fetchRegions} />
              )}

              {/* Редактировать регион */}
              {activeTab === 'editRegion' && (
                <EditRegion
                  role={user.role}
                  userName={user.name}
                  userID={user._id}
                />
              )}

              {/* Редактировать авторов туров */}
              {activeTab === 'brons' && <Brons />}
              {activeTab === 'touragents' && <Gids />}
              {activeTab === 'moderedAuthorTours' && <ModeredAuthorTours />}

              {/* Добавить О нас */}
              {activeTab === 'addAboutCompany' && <AddAboutCompany />}
              {activeTab === 'addOurTeam' && <AddOurTeam />}
              {activeTab === 'addOurMission' && <AddOurMission />}

              {/* Добавить Транфер */}
              {activeTab === 'addTransfer' && <AddTransfer />}

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
            </div>
          </div>
        </div>
      ) : null}
    </DndProvider>
  );
}

export default AdminPageNew;
