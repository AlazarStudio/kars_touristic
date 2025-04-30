import React, { useState, useEffect } from "react";
import classes from './FilterHotels.module.css';

function FilterHotels({ objects, updateFilteredObjects }) {

    const [filters, setFilters] = useState({
        city: "",
        stars: "",
    });

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        // Обновляем состояние только если значение действительно изменилось
        setFilters(prevFilters => {
            if (prevFilters[name] !== value) {
                return {
                    ...prevFilters,
                    [name]: value
                };
            }
            return prevFilters;
        });
    };

    const applyFilters = () => {
        const filteredObjects = objects.filter((item) => {
            const city = filters.city === "" || item.city.toLocaleLowerCase().includes(filters.city.toLocaleLowerCase());
            const stars = filters.stars === "" || item.stars == filters.stars;
            return city && stars;
        });
        updateFilteredObjects(filteredObjects);
    };

    return (
        <div className={classes.filter}>
            <input type="text" placeholder="Город, село, поселок" name="city" value={filters.city} onChange={handleFilterChange}/>

            <select name="stars" value={filters.stars} onChange={handleFilterChange}>
                <option value="" disabled>Количество звезд</option>
                <option value="5">5 звезд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="2">2 звезды</option>
                <option value="1">1 звезда</option>
                <option value="" >Показать все</option>
            </select>
        </div>
    );
}

export default FilterHotels;
