import React, { useState, useEffect } from "react";
import axios from "axios";
import Header_black from "../../Blocks/Header_black/Header_black";
import classes from './Search_Page.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";

import Object from "../../Blocks/Object/Object";

function Search_Page({ children, ...props }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const savedQuery = localStorage.getItem("searchQuery");
        if (savedQuery) {
            setSearchQuery(savedQuery);
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim() !== "") {
            performSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleInputChange = (event) => {
        const query = event.target.value;
        localStorage.setItem('searchQuery', query);
        setSearchQuery(query);
    };

    const performSearch = async (query) => {
        try {
            const requests = [
                axios.get('https://backend.karstouristic.ru/api/getMultidayTours'),
                axios.get('https://backend.karstouristic.ru/api/getOnedayTours'),
                axios.get('https://backend.karstouristic.ru/api/getHotels'),
                axios.get('https://backend.karstouristic.ru/api/getPlaces'),
                axios.get('https://backend.karstouristic.ru/api/getEvents'),
            ];

            const responses = await Promise.all(requests);

            const combinedResults = responses.flatMap(response => {
                if (response.data && response.data.multidayTour) {
                    return response.data.multidayTour;
                } else if (response.data && response.data.onedayTour) {
                    return response.data.onedayTour;
                } else if (response.data && response.data.hotels) {
                    return response.data.hotels;
                } else if (response.data && response.data.places) {
                    return response.data.places;
                } else if (response.data && response.data.events) {
                    return response.data.events;
                }
                return [];
            });

            setSearchResults(combinedResults);
        } catch (error) {
            console.error("Error performing search:", error);
        }
    };

    // Фильтрация результатов на основе searchQuery
    const filteredResults = searchResults.filter(result =>
        (result.title && result.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (result.tourTitle && result.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleClearClick = () => {
        setSearchQuery('');
        localStorage.removeItem('searchQuery');
    };

    return (
        <>
            <Header_black />
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.main_desc__inputBlock}>
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        {searchQuery && (
                            <p className={classes.clearButton} onClick={handleClearClick}>×</p>
                        )}
                    </div> 
                    <div className={classes.findElements}>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result, index) => (
                                <Object key={index} regionData={result} pageName={result.days.length == 1 ? 'excursions' : result.days.length > 1 ? 'tours' : result.rooms ? 'hotels' : result.mapLink ? 'visits' : null} titleObject={result.title ? 'title' : 'tourTitle'} />
                            ))
                        ) : (
                            <p>Ничего не найдено</p>
                        )}
                    </div>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Search_Page;
