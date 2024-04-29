import React, { useState, useEffect } from "react";
import classes from './Admin_Page.module.css';

import AddRegion from "./Blocks/AdminTabsComponents/AddRegion/AddRegion";
import AddAboutCompany from "./Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany";
import AddOurTeam from "./Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam";
import AddOurMission from "./Blocks/AdminTabsComponents/AddOurMission/AddOurMission";
import AddTransfer from "./Blocks/AdminTabsComponents/AddTransfer/AddTransfer";

function Admin_Page({ children, ...props }) {
    const [activeTab, setActiveTabInner] = useState('');
    const [openSection, setOpenSection] = useState('regions');
    const [regions, setRegions] = useState([]);
    const [isDirty, setIsDirty] = useState(false);

    const fetchRegions = () => {
        fetch('http://localhost:5002/api/getRegions')
            .then(response => response.json())
            .then(data => setRegions(data.regions))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    const setActiveTab = (tabName) => {
        if (isDirty && activeTab !== tabName) {
            if (window.confirm("У вас есть несохраненные изменения. Если вы уйдете, они будут утеряны. Продолжить?")) {
                setIsDirty(false);
                setActiveTabInner(tabName);
            }
        } else {
            setActiveTabInner(tabName);
        }
    };

    const isActive = (sectionName) => openSection === sectionName ? `${classes.boldText}` : '';

    return (
        <>
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
                            <div className={`${isActive('regions')} ${classes.hoverBlock}`} onClick={() => setOpenSection('regions')}>Регион</div>
                            {openSection === 'regions' && (
                                <div className={classes.admin_data__nav___item____desc}>
                                    <div className={classes.admin_data__nav___item____subItem_____add} onClick={() => setActiveTab('addRegion')}>
                                        + Добавить регион
                                    </div>
                                    {regions.map(region => (
                                        <div className={classes.admin_data__nav___item____subItem} key={region._id}>
                                            {region.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`${classes.admin_data__nav___item}`}>
                            <div className={`${isActive('about')} ${classes.hoverBlock}`} onClick={() => setOpenSection('about')}>О нас</div>
                            {openSection === 'about' && (
                                <div className={classes.admin_data__nav___item____desc}>
                                    <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addAboutCompany')}>О компании</div>
                                    <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addOurTeam')}>Наша команда</div>
                                    <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addOurMission')}>Наша миссия</div>
                                </div>
                            )}
                        </div>

                        <div
                            className={`${classes.admin_data__nav___item} ${isActive('addTransfer')} ${classes.hoverBlock}`}
                            onClick={() => { setActiveTab('addTransfer'); setOpenSection('addTransfer'); }}>
                            Трансфер
                        </div>

                        <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>FAQ</div>
                        <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>Контакты</div>
                        <div className={`${classes.admin_data__nav___item} ${classes.hoverBlock}`}>Турагентам</div>
                    </div>
                    <div className={classes.admin_data__info}>
                        {/* Добавить регион */}
                        {activeTab === 'addRegion' && <AddRegion fetchRegions={fetchRegions} setIsDirty={setIsDirty} />}
                        
                        {/* Добавить О нас */}
                        {activeTab === 'addAboutCompany' && <AddAboutCompany setIsDirty={setIsDirty} />}
                        {activeTab === 'addOurTeam' && <AddOurTeam setIsDirty={setIsDirty} />}
                        {activeTab === 'addOurMission' && <AddOurMission setIsDirty={setIsDirty} />}
                        
                        {/* Добавить Транфер */}
                        {activeTab === 'addTransfer' && <AddTransfer setIsDirty={setIsDirty} />}
                        
                        {/* Добавить FAQ */}
                        {/* {activeTab === 'addTransfer' && <AddTransfer setIsDirty={setIsDirty} />} */}


                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin_Page;
