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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/profile');
      return;
    }
    fetch(`${server}/api/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((userData) => {
        if (
          userData &&
          userData.adminPanelAccess === false &&
          userData.role !== 'admin' &&
          userData.role !== 'touragent'
        ) {
          navigate('/profile');
        } else {
          setUser(userData);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/profile');
      });
  }, []);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.container}>
        <div className={classes.containerLeft}>
          <a href="/" target="_blank" className={classes.containerLeftA}>
            <img
              src="/about_title_logo.webp"
              alt=""
              className={classes.containerLeftLogo}
            />
          </a>
          <div className={classes.containerLeftMenu}>
            {/* Навигация по секциям */}
          </div>
          <a href="/" className={classes.containerLeftBottom}>
            <img src="/Subtract.png" />
            Пререйти на сайт
          </a>
        </div>
        <div className={classes.containerRight}>
          <div className={classes.containerRightTopMenu}>
            <span>{currentDate}</span>
            {user && (
              <div className={classes.containerRightTopMenuAdmin}>
                <img src="" alt="Admin Avatar" />
                <div className={classes.containerRightTopMenuAdminName}>
                  <span>{user.name}</span>
                  <span>{user.role}</span>
                </div>
              </div>
            )}
          </div>
          <div className={classes.containerRightTop}>
            {selectedSection || 'Выберите раздел'}
          </div>
          <div className={classes.containerRightBottom}></div>
        </div>
      </div>
    </DndProvider>
  );
}
