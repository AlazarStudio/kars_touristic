// import { useEffect, useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page_new.module.css';
import server from '../../serverConfig';
import { useNavigate } from 'react-router-dom';

export default function containerLeft({ children, ...props }) {


  return (
<>
        <div className={classes.containerLeft}>
          <a href="/" target="_blank" className={classes.containerLeftA}>
            <img
              src="/about_title_logo.webp"
              alt=""
              className={classes.containerLeftLogo}
            />
          </a>
          <div className={classes.containerLeftMenu}>
         
          <a href="/" className={classes.containerLeftBottom}>
            <img src="/Subtract.png" />
            Пререйти на сайт
          </a>
        </div>
      
    </>
  );
}
