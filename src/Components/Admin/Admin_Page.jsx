import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Admin_Page.module.css';

import server from '../../serverConfig';

import AddRegion from "./Blocks/AdminTabsComponents/AddRegion/AddRegion";
import AddAboutCompany from "./Blocks/AdminTabsComponents/AddAboutCompany/AddAboutCompany";
import AddOurTeam from "./Blocks/AdminTabsComponents/AddOurTeam/AddOurTeam";
import AddOurMission from "./Blocks/AdminTabsComponents/AddOurMission/AddOurMission";
import AddTransfer from "./Blocks/AdminTabsComponents/AddTransfer/AddTransfer";
import AddFAQ from "./Blocks/AdminTabsComponents/AddFAQ/AddFAQ";
import AddContacts from "./Blocks/AdminTabsComponents/AddContacts/AddContacts";
import AddTuragent from "./Blocks/AdminTabsComponents/AddTuragent/AddTuragent";
import EditRegion from "./Blocks/AdminTabsComponents/EditRegion/EditRegion";
import CenterBlock from "../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../Standart/WidthBlock/WidthBlock";

const ItemType = {
    REGION: 'region',
};

function DraggableRegion({ region, index, moveRegion, activeTab }) {
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

    let activeShow = region.link == activeTab ? classes.boldText : '';

    return (
        <div ref={(node) => ref(drop(node))} className={`${classes.elemBlock} ${activeShow}`}>
            <Link to={`/admin/edit/${region.link}`} className={classes.admin_data__nav___item____subItem}>
                {region.title}
            </Link>
            <img src="/delete_region.webp" alt="" onClick={() => deleteElement(region._id)} />
        </div>
    );
}

function Admin_Page({ children, ...props }) {
    const { id, title } = useParams();
    
    let block = id;
    let boldName = id;

    let section = ''

    if (title) {
        boldName = title
        block = 'editRegion';
        section = 'regions';
    }
    if (block == 'addRegion') {
        section = 'regions';
    }
    if (block == 'addAboutCompany' || block == 'addOurTeam' || block == 'addOurMission') {
        section = 'about';
    }

    const [activeTab, setActiveTab] = useState(block);
    const [openSection, setOpenSection] = useState(section);
    const [regions, setRegions] = useState([]);

    const fetchRegions = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => setRegions(data.regions))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const isActive = (sectionName) => boldName === sectionName ? `${classes.boldText}` : '';
    const isActiveEdit = (sectionName) => id === sectionName ? `${classes.boldText}` : '';

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/getRegions`);
            const data = await response.json();
            setRegions(data.regions);
        } catch (error) {
            console.error("Error fetching Region info:", error);
        }
    }

    const deleteElement = async (id) => {
        if (confirm("Вы уверены, что хотите удалить регион?")) {
            try {
                await fetch(`${server}/api/deleteRegion/${id}`, {
                    method: 'DELETE'
                });
                setRegions(prevMembers => prevMembers.filter(member => member.id !== id));
            } catch (error) {
                console.error('Ошибка при удалении сотрудника:', error);
            }

            handleFormSuccess()
        }
    };

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    const [user, setUser] = useState();

    let token = localStorage.getItem('token');

    const navigate = useNavigate();

    const getUserInfo = async (token) => {
        const response = await fetch(`${server}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData)
        } else {
            localStorage.removeItem('token');
            console.error('Ошибка получения информации о пользователе');
        }
    };

    useEffect(() => {
        if (token) {
            getUserInfo(token);
        } else {
            navigate('/profile');
        }
    }, [token]);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/profile');
        }
    }, [user]);

    const moveRegion = (fromIndex, toIndex) => {
        const updatedRegions = [...regions];
        const [movedRegion] = updatedRegions.splice(fromIndex, 1);
        updatedRegions.splice(toIndex, 0, movedRegion);
        setRegions(updatedRegions);
    };
    

    return (
        <DndProvider backend={HTML5Backend}>
            {user && user.role && user.role == 'admin' ?
                <div className={classes.admin}>
                    <div className={classes.admin_header}>
                        <a href="/" target="_blank" className={classes.admin_header__logo}>
                            <img src="/about_title_logo.webp" alt="" />
                        </a>
                        <div className={classes.admin_header__items}>
                            <div className={classes.admin_header__items___item}>Отзывы</div>
                            <div className={classes.admin_header__items___item}>Заявки</div>
                            <div className={classes.admin_header__items___item____dashboard}>
                                <img src="/admin-panel 1.webp" alt="" />
                                Панель Администратора
                            </div>
                        </div>
                    </div>

                    <div className={classes.admin_data}>
                        <div className={classes.admin_data__nav}>
                            <div className={classes.admin_data__nav___item}>
                                <div className={`${isActive('addRegion')} ${isActiveEdit('edit')} ${classes.hoverBlock}`} onClick={() => setOpenSection('regions')}>Регион</div>
                                {openSection === 'regions' && (
                                    <div className={classes.admin_data__nav___item____desc}>
                                        <Link to={'/admin/addRegion'} className={`${classes.admin_data__nav___item____subItem} ${isActive('addRegion')}`} onClick={() => setActiveTab('addRegion')}>
                                            + Добавить регион
                                        </Link>

                                        {regions.map((region, index) => (
                                            <DraggableRegion
                                                key={region._id}
                                                region={region}
                                                index={index}
                                                moveRegion={moveRegion}
                                                deleteElement={deleteElement}
                                                activeTab={title}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={`${classes.admin_data__nav___item}`}>
                                <div className={`${isActive('addAboutCompany')} ${isActive('addOurTeam')} ${isActive('addOurMission')} ${classes.hoverBlock}`} onClick={() => setOpenSection('about')}>О нас</div>
                                {openSection === 'about' && (
                                    <div className={classes.admin_data__nav___item____desc}>
                                        <Link to={`/admin/addAboutCompany`} className={`${classes.admin_data__nav___item____subItem} ${isActive('addAboutCompany')}`} onClick={() => setActiveTab('addAboutCompany')}>О компании</Link>
                                        <Link to={`/admin/addOurTeam`} className={`${classes.admin_data__nav___item____subItem} ${isActive('addOurTeam')}`} onClick={() => setActiveTab('addOurTeam')}>Наша команда</Link>
                                        <Link to={`/admin/addOurMission`} className={`${classes.admin_data__nav___item____subItem} ${isActive('addOurMission')}`} onClick={() => setActiveTab('addOurMission')}>Наша миссия</Link>
                                    </div>
                                )}
                            </div>

                            <Link to={`/admin/addTransfer`}
                                className={`${classes.admin_data__nav___item} ${isActive('addTransfer')} ${classes.hoverBlock}`}
                                onClick={() => { setActiveTab('addTransfer'); setOpenSection('addTransfer'); }}>
                                Трансфер
                            </Link>

                            <Link to={`/admin/addFAQ`}
                                className={`${classes.admin_data__nav___item} ${isActive('addFAQ')} ${classes.hoverBlock}`}
                                onClick={() => { setActiveTab('addFAQ'); setOpenSection('addFAQ'); }}>
                                FAQ
                            </Link>

                            <Link to={`/admin/addContacts`}
                                className={`${classes.admin_data__nav___item} ${isActive('addContacts')} ${classes.hoverBlock}`}
                                onClick={() => { setActiveTab('addContacts'); setOpenSection('addContacts'); }}>
                                Контакты
                            </Link>

                            <Link to={`/admin/addTuragent`}
                                className={`${classes.admin_data__nav___item} ${isActive('addTuragent')} ${classes.hoverBlock}`}
                                onClick={() => { setActiveTab('addTuragent'); setOpenSection('addTuragent'); }}>
                                Турагентам
                            </Link>
                        </div>
                        <div className={classes.admin_data__info}>
                            {/* Добавить регион */}
                            {activeTab === 'addRegion' && <AddRegion fetchRegions={fetchRegions} />}

                            {/* Редактировать регион */}
                            {activeTab === 'editRegion' && <EditRegion />}

                            {/* Добавить О нас */}
                            {activeTab === 'addAboutCompany' && <AddAboutCompany />}
                            {activeTab === 'addOurTeam' && <AddOurTeam />}
                            {activeTab === 'addOurMission' && <AddOurMission />}

                            {/* Добавить Транфер */}
                            {activeTab === 'addTransfer' && <AddTransfer />}

                            {/* Добавить FAQ */}
                            {activeTab === 'addFAQ' && <AddFAQ />}

                            {/* Добавить Контакты */}
                            {activeTab === 'addContacts' && <AddContacts />}

                            {/* Добавить Турагентам */}
                            {activeTab === 'addTuragent' && <AddTuragent />}
                        </div>
                    </div>
                </div>
                : null
            }
        </DndProvider>
    );
}

export default Admin_Page;
