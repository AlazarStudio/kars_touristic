import React, { useState, useEffect } from "react";
import classes from './FilterPlaces.module.css';

function FilterPlaces({ objects, updateFilteredObjects }) {

    const [filters, setFilters] = useState({
        title: "",
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
            const title = filters.title === "" || item.title.toLocaleLowerCase().includes(filters.title.toLocaleLowerCase());
            return title;
        });
        updateFilteredObjects(filteredObjects);
    };

    return (
        <div className={classes.filter}>
            <input type="text" placeholder="Введите наименование" name="title" value={filters.title} onChange={handleFilterChange}/>
        </div>
    );
}

export default FilterPlaces;
