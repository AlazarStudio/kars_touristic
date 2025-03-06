import classes from './ContainerLeft.module.css';

export default function ContainerLeft({ children, ...props }) {
  return (
    <>
      <div className={classes.container}>
        <a href="/" target="_blank" className={classes.containerLeftA}>
          <img
            src="/about_title_logo.webp"
            alt=""
            className={classes.containerLeftLogo}
          />
        </a>
        <div className={classes.con}
        <span> Пользователи</span>
        <span> Страницы</span>
        <span> Брони</span>
        <span> Неподтвержденные туры</span>
      </div>
    </>
  );
}
