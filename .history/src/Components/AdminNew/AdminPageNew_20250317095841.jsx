import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import classes from './AdminPageNew.module.css';

import server from '../../serverConfig';

import AddRegion from './Blocks/AdminTabsComponents/AddRegion/AddRegion';
import EditRegion from './Blocks/AdminTabsComponents/EditRegion/EditRegion';
import AddAboutCompany from './Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany';
import AddOurTeam from './Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam';
import AddOurMission from './Blocks/AdminTabsComponents/AddOurMission/AddOurMission';
import AddTransfer from './Blocks/AdminTabsComponents/AddTransfer/AddTransfer';
import AddFAQ from './Blocks/AdminTabsComponents/AddFAQ/AddFAQ';
import AddContacts from './Blocks/AdminTabsComponents/AddContacts/AddContacts';
import AddTuragent from './Blocks/AdminTabsComponents/AddTuragent/AddTuragent';
import Brons from './Blocks/AdminTabsComponents/Brons/Brons';
import AddUsers from './Blocks/AdminTabsComponents/AddUsers/AddUsers';
import AddHotelAndApartments from './Blocks/AdminTabsComponents/AddHotelAndApartments/AddHotelAndApartments';

function AdminPageNew() {
    const { id, title } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState(id);
    const [regions, setRegions] = useState([]);
    const [openSections, setOpenSections] = useState({
        pages: false,
        about: false,
        transfer: false,
        faq: false,
        contacts: false,
        touragents: false,
        brons: false,
        hotels: false,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${server}/api/user`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => setUser(data))
                .catch(() => navigate('/profile'));
        } else {
            navigate('/profile');
        }
    }, [navigate]);

    useEffect(() => {
        fetch(`${server}/api/getRegions`)
            .then((res) => res.json())
            .then((data) => setRegions(data.regions))
            .catch(console.error);
    }, []);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section], // Инвертируем состояние только текущей секции
        }));
    };

    if (!user || !user.adminPanelAccess || (user.role !== 'admin' && user.role !== 'touragent')) {
        return null;
    }

    return (
        <div className={classes.admin}>
            <div className={classes.admin_data}>
                <div className={classes.admin_data__nav}>
                    <Link to="/admin/addUsers" className={classes.nav_title}>
                        Пользователи
                    </Link>

                    {/* Страницы */}
                    <div className={classes.nav_title} onClick={() => toggleSection('pages')}>
                        Страницы
                    </div>
                    {openSections.pages && (
                        <div className={classes.admin_data__nav___item}>
                            <Link to="/admin/addRegion">Добавить регион</Link>
                            {regions.map((region) => (
                                <Link key={region._id} to={`/admin/edit/${region.link}`}>
                                    {region.title}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* О нас */}
                    <div className={classes.nav_title} onClick={() => toggleSection('about')}>
                        О нас
                    </div>
                    {openSections.about && (
                        <div className={classes.admin_data__nav___item}>
                            <Link to="/admin/addAboutCompany">О компании</Link>
                            <Link to="/admin/addOurTeam">Наша команда</Link>
                            <Link to="/admin/addOurMission">Наша миссия</Link>
                        </div>
                    )}

                    {/* Трансфер */}
                    <div className={classes.nav_title} onClick={() => toggleSection('transfer')}>
                        Трансфер
                    </div>
                    {openSections.transfer && (
                        <Link to="/admin/addTransfer" className={classes.admin_data__nav___item}>
                            Добавить Трансфер
                        </Link>
                    )}

                    {/* FAQ */}
                    <div className={classes.nav_title} onClick={() => toggleSection('faq')}>
                        FAQ
                    </div>
                    {openSections.faq && (
                        <Link to="/admin/addFAQ" className={classes.admin_data__nav___item}>
                            Добавить FAQ
                        </Link>
                    )}

                    {/* Контакты */}
                    <div className={classes.nav_title} onClick={() => toggleSection('contacts')}>
                        Контакты
                    </div>
                    {openSections.contacts && (
                        <Link to="/admin/addContacts" className={classes.admin_data__nav___item}>
                            Добавить Контакты
                        </Link>
                    )}

                    {/* Турагентам */}
                    <div className={classes.nav_title} onClick={() => toggleSection('touragents')}>
                        Турагентам
                    </div>
                    {openSections.touragents && (
                        <Link to="/admin/addTuragent" className={classes.admin_data__nav___item}>
                            Добавить Турагента
                        </Link>
                    )}

                    {/* Брони */}
                    <div className={classes.nav_title} onClick={() => toggleSection('brons')}>
                        Брони
                    </div>
                    {openSections.brons && (
                        <Link to="/admin/brons" className={classes.admin_data__nav___item}>
                            Брони туров
                        </Link>
                    )}

                    {/* Брони отелей */}
                    <div className={classes.nav_title} onClick={() => toggleSection('hotels')}>
                        Брони отелей
                    </div>
                    {openSections.hotels && (
                        <Link to="/admin/addHotelAndApartments" className={classes.admin_data__nav___item}>
                            Добавить Бронь Отеля
                        </Link>
                    )}
                </div>

                <div className={classes.admin_data__info}>
                    {activeTab === 'addRegion' && <AddRegion />}
                    {activeTab === 'editRegion' && <EditRegion />}
                    {activeTab === 'addAboutCompany' && <AddAboutCompany />}
                    {activeTab === 'addOurTeam' && <AddOurTeam />}
                    {activeTab === 'addOurMission' && <AddOurMission />}
                    {activeTab === 'addTransfer' && <AddTransfer />}
                    {activeTab === 'addFAQ' && <AddFAQ />}
                    {activeTab === 'addContacts' && <AddContacts />}
                    {activeTab === 'addTuragent' && <AddTuragent />}
                    {activeTab === 'addUsers' && <AddUsers />}
                    {activeTab === 'addHotelAndApartments' && <AddHotelAndApartments />}
                    {activeTab === 'brons' && <Brons />}
                </div>
            </div>
        </div>
    );
}

export default AdminPageNew;
