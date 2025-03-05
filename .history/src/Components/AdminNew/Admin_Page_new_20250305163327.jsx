import { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import classes from './Admin_Page_new.module.css';

const sections = [
  { 
    title: 'Пользователи', 
    items: ['Админы', 'Модераторы', 'Клиенты'] 
  },
  { 
    title: 'Страницы', 
    items: [
      { 
        title: 'Регион', 
        subItems: ['Города', 'Области', 'Страны']
      }, 
      'О нас', 'Трансфер', 'FAQ', 'Контакты', '', 
    ] 
  },
  { 
    title: 'Брони', 
    items: ['Брони туров', 'Брони отелей'] 
  },
  { 
    title: 'Неподтвержденные туры', 
    items: ['Ожидающие', 'Отклоненные'] 
  }
];

export default function Admin_Page_new() {
  const [openSections, setOpenSections] = useState({});
  const [openSubSections, setOpenSubSections] = useState({});

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

  return (
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
          {sections.map((section) => (
            <div key={section.title} className={classes.containerLeftSection}>
              <div
                className={classes.sectionHeader}
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                {openSections[section.title] ? <ExpandLess /> : <ExpandMore />}
              </div>
              {openSections[section.title] && (
                <div className={classes.sectionContent}>
                  {section.items.map((item) => (
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
                          {openSubSections[item.title] ? <ExpandLess /> : <ExpandMore />}
                        </div>
                        {openSubSections[item.title] && (
                          <div className={classes.subSectionContent}>
                            {item.subItems.map((subItem) => (
                              <div key={subItem} className={classes.subSectionItem}>
                                {subItem}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}
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
  );
}
