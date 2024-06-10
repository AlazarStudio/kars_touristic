import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import classes from './Main.module.css';
import Region from "../Region/Region";

import server from '../../../serverConfig';

function Main({ children, ...props }) {

    const [regions, setRegions] = useState([]);

    const fetchRegions = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => setRegions(data.regions.reverse()))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    return (
        <>
            <div className={classes.main}>
                <div className={classes.main_title}>Организуем ваш отдых на Кавказе</div>
                {/* <div className={classes.main_desc}>
                    <select name="" id="">
                        <option value="1">Многодневные туры</option>
                        <option value="1">Однодневные туры</option>
                        <option value="1">Авторские туры</option>
                        <option value="1">Отели</option>
                        <option value="1">Что посетить</option>
                        <option value="1">Региональные ивенты</option>
                    </select>
                    <input type="search" placeholder="Поиск" />
                    <button>Найти</button>
                </div> */}
                <div className={classes.main_blocks}>
                    {
                        regions.map((item, index) => (
                            <Region key={index} link={item.link} title={item.title} bg={item.coverImgPath} logo={item.iconPath} />
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Main;