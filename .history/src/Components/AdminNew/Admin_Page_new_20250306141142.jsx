import { useEffect, useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page_new.module.css';
import server from '../../serverConfig';
import { useNavigate } from 'react-router-dom';

export default function Admin_Page_new({ children, ...props }) {
  const [openSections, setOpenSections] = useState({});
  const [openSubSections, setOpenSubSections] = useState({});
  const [regions, setRegions] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [dynamicSections, setDynamicSections] = useState([
    {
      title: 'Пользователи',
      items: [],
    },
    {
      title: 'Страницы',
      items: [
        {
          title: 'Регион',
          subItems: ['Добавить регион'],
        },
        'О нас',
        'Трансфер',
        'FAQ',
        'Контакты',
        'Турагентам',
      ],
    },
    {
      title: 'Брони',
      items: ['Брони туров', 'Брони отелей'],
    },
    {
      title: 'Неподтвержденные туры',
      items: ['Все'],
    },
  ]);

  const formatDate = () => {
    const date = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('ru-RU', options);
  };

  const [currentDate, setCurrentDate] = useState(formatDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(formatDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${server}/api/getRegions`)
      .then((response) => response.json())
      .then((data) => {
        const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
        setRegions(sortedRegions);
      })
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  }, []);

  useEffect(() => {
    setDynamicSections((prevSections) =>
      prevSections.map((section) =>
        section.title === 'Страницы'
          ? {
              ...section,
              items: section.items.map((item) =>
                typeof item === 'object' && item.title === 'Регион'
                  ? { ...item, subItems: regions.map((region) => region.title) }
                  : item
              ),
            }
          : section
      )
    );
  }, [regions]);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
    setSelectedSection(title);
  };

  const toggleSubSection = (title) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
    setSelectedSection(title);
  };

  // Получение пользователей

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

  // console.log(user.name);

  // Получение пользователей

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.container}>
<container
        <div className={classes.containerRight}>
          <div className={classes.containerRightTop}>
            <span>{selectedSection}</span>
            <div className={classes.containerRightTopMenu}>
              <span>{currentDate}</span>
              {user && (
                <div className={classes.containerRightTopMenuAdmin}>
                  {/* <img src="" alt="Admin Avatar" /> */}
                  <div className={classes.containerRightTopMenuAdminName}>
                    <span>{user.role}</span>
                    <span>{user.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={classes.containerRightBottom}></div>
        </div>
      </div>
    </DndProvider>
  );
}
