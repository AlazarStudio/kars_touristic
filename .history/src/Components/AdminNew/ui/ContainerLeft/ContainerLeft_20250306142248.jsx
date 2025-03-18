import { useState } from 'react';
import classes from './ContainerLeft.module.css';

export default function ContainerLeft({ children, ...props }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={classes.container}>
      <a href="/" target="_blank" className={classes.containerLeftA}>
        <img
          src="/about_title_logo.webp"
          alt=""
          className={classes.containerLogo}
        />
      </a>
      <div className={classes.containerMenuWrapper}>
        <div
          className={classes.containerMenuHeader}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span>Меню</span>
          <span className={isMenuOpen ? classes.arrowUp : classes.arrowDown}>
            ▼
          </span>
        </div>
        {isMenuOpen && (
          <div className={classes.containerMenu}>
            <span>Пользователи</span>
            <span>Страницы</span>
            <span>Брони</span>
            <span>Неподтвержденные туры</span>
          </div>
        )}
      </div>
      <span>
        <img src="" alt="site" />
        <span>Перейти на сайт</span>
      </span>
    </div>
  );
}
