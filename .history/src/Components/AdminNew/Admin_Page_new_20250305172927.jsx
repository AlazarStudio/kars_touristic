import { useEffect, useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page_new.module.css';
import server from '../../serverConfig';

// const sections = [
//   {
//     title: 'Пользователи',
//     items: ['Пользователи', 'Представители', 'Администраторы', 'Авторы туров'],
//   },
//   {
//     title: 'Страницы',
//     items: [
//       {
//         title: 'Регион',
//         subItems: [], // Заполнится из БД
//       },
//       'О нас',
//       'Трансфер',
//       'FAQ',
//       'Контакты',
//       'Турагентам',
//     ],
//   },
//   {
//     title: 'Брони',
//     items: ['Брони туров', 'Брони отелей'],
//   },
//   {
//     title: 'Неподтвержденные туры',
//     items: ['Все'],
//   },
// ];

export default function Admin_Page_new({ children, ...props }) {
  const [openSections, setOpenSections] = useState({});
  const [openSubSections, setOpenSubSections] = useState({});
  const [regions, setRegions] = useState([]);
  const [dynamicSections, setDynamicSections] = useState([
    {
      title: 'Пользователи',
      items: [
        'Пользователи',
        'Представители',
        'Администраторы',
        'Авторы туров',
      ],
    },
    {
      title: 'Страницы',
      items: [
        {
          title: 'Регион',
          subItems: [], // Заполнится из БД
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

  // Функция для загрузки регионов из БД
  useEffect(() => {
    fetch(`${server}/api/getRegions`)
      .then((response) => response.json())
      .then((data) => {
        const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
        setRegions(sortedRegions);
      })
      .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  }, []);

  // Обновляем `dynamicSections` при изменении `regions`
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

  // const fetchRegions = () => {
  //   fetch(`${server}/api/getRegions`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
  //       setRegions(sortedRegions);
  //     })
  //     .catch((error) => console.error('Ошибка при загрузке регионов:', error));
  // };

  // useEffect(() => {
  //   fetchRegions();
  // }, []);

  // useEffect(() => {
  //   sections
  //     .find((section) => section.title === 'Страницы')
  //     .items.find(
  //       (item) => typeof item === 'object' && item.title === 'Регион'
  //     ).subItems = regions;
  // }, [regions]);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleSubSection = (title) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  console.log(regions);

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
                        <div key={item} className={classes.sectionItem}>
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
        <div className={classes.containerRight}>2</div>
      </div>
    </DndProvider>
  );
}
