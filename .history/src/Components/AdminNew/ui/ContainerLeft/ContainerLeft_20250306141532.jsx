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
        <span> Пользователи</span>
        <span> Пользователи</span>
        <span> Пользователи</span>
        <span> Пользователи</span>
      </div>
    </>
  );
}
