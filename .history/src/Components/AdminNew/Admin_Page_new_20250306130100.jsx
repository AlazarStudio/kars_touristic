import { useEffect, useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page_new.module.css';
import server from '../../serverConfig';

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
          subItems: [],
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

  {}

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
            {dynamicSections.map((section) => (
              <div key={section.title} className={classes.containerLeftSection}>
                <div
                  className={classes.sectionHeader}
                  onClick={() => toggleSection(section.title)}
                >
                  {section.title}
                  {openSections[section.title] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </div>
                {openSections[section.title] && (
                  <div className={classes.sectionContent}>
                    {section.items.map((item) =>
                      typeof item === 'string' ? (
                        <div
                          key={item}
                          className={classes.sectionItem}
                          onClick={() => setSelectedSection(item)}
                        >
                          {item}
                        </div>
                      ) : (
                        <div key={item.title} className={classes.subSection}>
                          <div
                            className={classes.subSectionHeader}
                            onClick={() => toggleSubSection(item.title)}
                          >
                            {item.title}
                            {openSubSections[item.title] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </div>
                          {openSubSections[item.title] && (
                            <div className={classes.subSectionContent}>
                              {item.subItems.map((subItem) => (
                                <div
                                  key={subItem}
                                  className={classes.subSectionItem}
                                  onClick={() => setSelectedSection(subItem)}
                                >
                                  {subItem}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <a href="/" className={classes.containerLeftBottom}>
            <img src="/Subtract.png" />
            Пререйти на сайт
          </a>
        </div>
        <div className={classes.containerRight}>
          <div className={classes.containerRightTop}>
            <span>{selectedSection}</span>
            <div className={classes.containerRightTopMenu}>
              <span>{currentDate}</span>
              <div className={classes.containerRightTopMenuAdmin}>
                <img src="" />
                <div className={classes.containerRightTopMenuAdminName}>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.containerRightBottom}></div>
        </div>
      </div>
    </DndProvider>
  );
}
