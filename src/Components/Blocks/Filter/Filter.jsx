import React from "react";
import classes from './Filter.module.css';

function Filter({ children, filters, handleFilterChange, ...props }) {
    return (
        <>
            <div className={classes.filter}>
                <select name="city" value={filters.city} onChange={handleFilterChange}>
                    <option value="" disabled>Город</option>
                    <option value="Черкесск">Черкесск</option>
                    <option value="Карачаевск">Карачаевск</option>
                    <option value="Архыз">Архыз</option>
                    <option value="Домбай">Домбай</option>
                    <option value="Теберда">Теберда</option>
                    <option value="Показать все">Показать все</option>
                </select>

                <select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="" disabled>Категория</option>
                    <option value="Детские">Детские</option>
                    <option value="Гастрономические">Гастрономические</option>
                    <option value="Конные">Конные</option>
                    <option value="Познавательные">Познавательные</option>
                    <option value="Религиозные">Религиозные</option>
                    <option value="Показать все">Показать все</option>
                </select>

                <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />

                <select name="tripType" value={filters.tripType} onChange={handleFilterChange}>
                    <option value="" disabled>Тип поездки</option>
                    <option value="Групповая поездка">Групповая поездка</option>
                    <option value="Индивидуальная поездка">Индивидуальная поездка</option>
                    <option value="VIP">VIP</option>
                    <option value="Показать все">Показать все</option>
                </select>
            </div>
        </>
    );
}

export default Filter;