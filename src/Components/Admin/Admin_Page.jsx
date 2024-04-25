import React, { useState, useEffect } from "react";
import classes from './Admin_Page.module.css';
import CenterBlock from "../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../Standart/WidthBlock/WidthBlock";

import Form from "../Admin/Blocks/Form/Form"


function Admin_Page({ children, ...props }) {
    const [activeTab, setActiveTab] = useState('addRegion');

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

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
                                    <div className={classes.admin_data__nav___item____title}>Регион</div>
                                    <div className={classes.admin_data__nav___item____desc}>
                                        <div
                                            className={classes.admin_data__nav___item____subItem_____add}
                                            onClick={() => setActiveTab('addRegion')}
                                        >
                                            + Добавить регион
                                        </div>
                                        <div className={classes.admin_data__nav___item____subItem} onClick={() => setActiveTab('addRegion2')}>Карачаево-Черкессия</div>
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
                                </div>
                                <div className={classes.admin_data__nav___item}>О нас</div>
                                <div className={classes.admin_data__nav___item}>Трансфер</div>
                                <div className={classes.admin_data__nav___item}>FAQ</div>
                                <div className={classes.admin_data__nav___item}>Контакты</div>
                                <div className={classes.admin_data__nav___item}>Турагентам</div>
                            </div>
                            <div className={classes.admin_data__info}>
                                {activeTab === 'addRegion' &&
                                    <div className={classes.addData}>
                                        <div className={classes.addData_title}>ДОБАВИТЬ РЕГИОН</div>

                                        <Form actionUrl="http://localhost:5002/api/addRegion" method="post">
                                            <label>Введите название региона</label>
                                            <input name="title" type="text" placeholder="Название" required />

                                            <label>Добавить описание</label>
                                            <textarea name="description" placeholder="Описание" required />

                                            <label>Загрузите иконку для региона</label>
                                            <input type="file" name="iconPath" className={classes.noBorder} required />

                                            <label>Загрузите фото для обложки региона (на главной) </label>
                                            <input type="file" name="coverImgPath" className={classes.noBorder} required />                                            

                                            <label>Загрузите фото для фона региона</label>
                                            <input type="file" name="backgroundImgPath" className={classes.noBorder} required />                                            
                                        </Form>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Admin_Page;