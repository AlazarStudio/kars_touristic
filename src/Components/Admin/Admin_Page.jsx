import React, { useState, useEffect } from "react";
import classes from './Admin_Page.module.css';
import CenterBlock from "../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../Standart/WidthBlock/WidthBlock";

import AddRegion from "./Blocks/AdminTabsComponents/AddRegion/AddRegion";
import AddAboutCompany from "./Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany";
import AddOurTeam from "./Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam";
import AddOurMission from "./Blocks/AdminTabsComponents/AddOurMission/AddOurMission";


function Admin_Page({ children, ...props }) {
    const [activeTab, setActiveTab] = useState('');
    const [openSection, setOpenSection] = useState('');

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    const toggleSection = (sectionName) => {
        if (openSection === sectionName) {
            setOpenSection(''); // Закрыть текущий раздел, если он уже открыт
        } else {
            setOpenSection(sectionName);
        }
    };
    
    const isActive = (sectionName) => openSection === sectionName ? `${classes.boldText}` : '';

    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.admin}>
                        <div className={classes.admin_header}>
                            <a href="/" target="_blank" className={classes.admin_header__logo}>
                                <img src="/about_title_logo.png" alt="" />
                            </a>
                            <div className={classes.admin_header__items}>
                                <div className={classes.admin_header__items___item}>Отзывы</div>
                                <div className={classes.admin_header__items___item}>Заявки</div>
                                <div className={classes.admin_header__items___item____dashboard}>
                                    <img src="/admin-panel 1.png" alt="" />
                                    Панель Администратора
                                </div>
                            </div>
                        </div>

                        <div className={classes.admin_data}>
                            <div className={classes.admin_data__nav}>
                                <div className={classes.admin_data__nav___item}>
                                    <div className={`${classes.admin_data__nav___item____title} ${isActive('regions')} ${classes.hoverBlock}`}  onClick={() => toggleSection('regions')}>Регион</div>
                                    {openSection === 'regions' && (
                                        <div className={classes.admin_data__nav___item____desc}>
                                            <div
                                                className={classes.admin_data__nav___item____subItem_____add}
                                                onClick={() => setActiveTab('addRegion')}
                                            >
                                                + Добавить регион
                                            </div>
                                            <div className={classes.admin_data__nav___item____subItem}>Карачаево-Черкессия</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Кабардино-Балкария</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Осетия</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Ингушетия</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Чечня</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Дагестан</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Адыгея</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Краснодарский край</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Ставропольский край</div>
                                            <div className={classes.admin_data__nav___item____subItem}>Абхазия</div>
                                        </div>
                                    )}
                                </div>
                                <div className={`${classes.admin_data__nav___item}`}>
                                    <div className={`${classes.admin_data__nav___item____title} ${isActive('about')} ${classes.hoverBlock}`} onClick={() => toggleSection('about')}>О нас</div>
                                    {openSection === 'about' && (<div className={classes.admin_data__nav___item____desc}>
                                        <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addAboutCompany')}>О компании</div>
                                        <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addOurTeam')} >Наша команда</div>
                                        <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addOurMission')} >Наша миссия</div>
                                    </div>
                                    )}
                                </div>
                                <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>Трансфер</div>
                                <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>FAQ</div>
                                <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>Контакты</div>
                                <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>Турагентам</div>
                            </div>
                            <div className={classes.admin_data__info}>
                                {/* Добавить регион */}
                                {activeTab === 'addRegion' && <AddRegion />}

                                {/* О нас */}
                                {activeTab === 'addAboutCompany' && <AddAboutCompany />}
                                {activeTab === 'addOurTeam' && <AddOurTeam />}
                                {activeTab === 'addOurMission' && <AddOurMission />}
                            </div>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Admin_Page;