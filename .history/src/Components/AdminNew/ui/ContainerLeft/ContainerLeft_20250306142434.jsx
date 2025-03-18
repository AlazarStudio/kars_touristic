import { useState } from 'react';
import classes from './ContainerLeft.module.css';

export default function ContainerLeft({ children, ...props }) {
  // Храним состояние для каждого раздела
  const [openSections, setOpenSections] = useState({
    users: true,
    pages: true,
    bookings: true,
    unconfirmedTours: true,
  });

  // Функция переключения видимости
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={classes.container}>
      <a href="/" target="_blank" className={classes.containerLeftA}>
        <img
          src="/about_title_logo.webp"
          alt=""
          className={classes.containerLogo}
        />
      </a>
      <div className={classes.containerMenu}>
        <div className={classes.menuItem} onClick={() => toggleSection('users')}>
          <span>Пользователи</span>
          <span className={openSections.users ? classes.arrowUp : classes.arrowDown}>▼</span>
        </div>
        {openSections.users && (
          <div className={classes.subMenu}>
            <span>Все пользователи</span>
            <span>Администраторы</span>
            <span>Клиенты</span>
          </div>
        )}

        <div className={classes.menuItem} onClick={() => toggleSection('pages')}>
          <span>Страницы</span>
          <span className={openSections.pages ? classes.arrowUp : classes.arrowDown}>▼</span>
        </div>
        {openSections.pages && (
          <div className={classes.subMenu}>
            <span>Главная</span>
            <span>О нас</span>
            <span>Контакты</span>
          </div>
        )}

        <div className={classes.menuItem} onClick={() => toggleSection('bookings')}>
          <span>Брони</span>
          <span className={openSections.bookings ? classes.arrowUp : classes.arrowDown}>▼</span>
        </div>
        {openSections.bookings && (
          <div className={classes.subMenu}>
            <span>Активные брони</span>
            <span>История бронирований</span>
          </div>
        )}

        <div className={classes.menuItem} onClick={() => toggleSection('unconfirmedTours')}>
          <span>Неподтвержденные туры</span>
          <span className={openSections.unconfirmedTours ? classes.arrowUp : classes.arrowDown}>▼</span>
        </div>
        {openSections.unconfirmedTours && (
          <div className={classes.subMenu}>
            <span>Все неподтвержденные</span>
            <span>Ожидают ответа</span>
          </div>
        )}
      </div>

      <span className={classes.siteLink}>
        <img src="" alt="site" />
        <span>Перейти на сайт</span>
      </span>
    </div>
  );
}
