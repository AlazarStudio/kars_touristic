import { useState } from 'react';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page_new.module.css';

import server from '../../serverConfig';

import AddRegion from './Blocks/AdminTabsComponents/AddRegion/AddRegion';
import AddAboutCompany from './Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany';
import AddOurTeam from './Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam';
import AddOurMission from './Blocks/AdminTabsComponents/AddOurMission/AddOurMission';
import AddTransfer from './Blocks/AdminTabsComponents/AddTransfer/AddTransfer';
import AddFAQ from './Blocks/AdminTabsComponents/AddFAQ/AddFAQ';
import AddContacts from './Blocks/AdminTabsComponents/AddContacts/AddContacts';
import AddTuragent from './Blocks/AdminTabsComponents/AddTuragent/AddTuragent';
import EditRegion from './Blocks/AdminTabsComponents/EditRegion/EditRegion';
import CenterBlock from '../Standart/CenterBlock/CenterBlock';
import WidthBlock from '../Standart/WidthBlock/WidthBlock';
import Gids from './Blocks/AdminTabsComponents/Gids/Gids';
import ModeredAuthorTours from './Blocks/AdminTabsComponents/ModeredAuthorTours/ModeredAuthorTours';
import AddAgent from './Blocks/AdminTabsComponents/AddAgent/AddAgent';
import Brons from './Blocks/AdminTabsComponents/Brons/Brons';
import AddUsers from './Blocks/AdminTabsComponents/AddUsers/AddUsers';
import AddHotelAndApartments from './Blocks/AdminTabsComponents/AddHotelAndApartments/AddHotelAndApartments';

const sections = [
  {
    title: 'Пользователи',
    items: ['Пользователи', 'Представители', 'Администраторы', 'Авторы туров'],
  },
  {
    title: 'Страницы',
    items: [
      {
        title: 'Регион',
        subItems: ['Города', 'Области', 'Страны'],
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
];

const ItemType = {
  REGION: 'region',
};

function DraggableRegion({
  region,
  index,
  moveRegion,
  activeTab,
  deleteElement,
  setActiveTab,
  role,
}) {
  const [, ref] = useDrag({
    type: ItemType.REGION,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.REGION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRegion(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  let activeShow = region.link === activeTab ? classes.boldText : '';

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`${classes.elemBlock} ${activeShow}`}
    >
      <Link
        to={`/admin/edit/${region.link}`}
        className={classes.admin_data__nav___item____subItem}
        onClick={() => setActiveTab('editRegion')}
      >
        {region.title}
      </Link>
      {role === 'admin' ? (
        <img
          src="/delete_region.webp"
          alt=""
          onClick={() => deleteElement(region._id)}
        />
      ) : null}
    </div>
  );
}

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
