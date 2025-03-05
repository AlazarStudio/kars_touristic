import { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import classes from './Admin_Page_new.module.css';

const sections = [
  { title: 'Пользователи', items: ['Админы', 'Модераторы', 'Клиенты'] },
  { title: 'Страницы', items: ['Главная', 'О нас', 'Контакты'] },
  { title: 'Брони', items: ['Активные', 'Завершенные', 'Отмененные'] },
  { title: 'Неподтвержденные туры', items: ['Ожидающие', 'Отклоненные'] },
];

export default function Admin_Page_new() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
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
                  <div key={item} className={classes.sectionItem}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
        <div className={classes.containerLeftBottom}>
          <img src=''
        </div>
      </div>
      <div className={classes.containerRight}>2</div>
    </div>
  );
}
