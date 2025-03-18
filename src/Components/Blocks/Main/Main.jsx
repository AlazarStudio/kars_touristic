import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import classes from './Main.module.css';
import Region from "../Region/Region";
import server from '../../../serverConfig';

function Main({ children, tempMain, ...props }) {
    const [regions, setRegions] = useState([]);
    const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
    const navigate = useNavigate();

    const fetchRegions = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => {
                const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
                setRegions(sortedRegions);
            })
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchRegions();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchQuery != '') {
            localStorage.setItem('searchQuery', searchQuery);
            navigate('/search');
        }
    };

    const handleClearClick = () => {
        setSearchQuery('');
        localStorage.removeItem('searchQuery');
    };

    if (tempMain) {
        navigate(`/region/${tempMain}`);
    }

    return (
        <>
            {!tempMain &&
                <div className={classes.main}>
                    <div className={classes.main_title}>Организуем ваш отдых на Кавказе</div>
                    <div className={classes.main_desc}>
                        <div className={classes.main_desc__inputBlock}>
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <p className={classes.clearButton} onClick={handleClearClick}>×</p>
                            )}
                        </div>

                        <button className={classes.searchButton} onClick={handleSearchClick}>Найти</button>
                    </div>
                    <div className={classes.main_blocks}>
                        {regions.map((item, index) => (
                            <Region key={index} link={item.link} title={item.title} bg={item.coverImgPath} logo={item.iconPath} />
                        ))}
                    </div>
                </div>
            }
        </>
    );
}

export default Main;
