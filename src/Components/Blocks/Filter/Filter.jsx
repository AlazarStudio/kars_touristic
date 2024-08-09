import React, { useState, useEffect } from "react";
import classes from './Filter.module.css';

function Filter({ objects, updateFilteredObjects }) {

    const [filters, setFilters] = useState({
        places: "",
        travelMethod: "",
        tourType: "",
        difficulty: ""
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
            const places = filters.places === "" || item.places.toLocaleLowerCase().includes(filters.places.toLocaleLowerCase());
            const travelMethod = filters.travelMethod === "" || item.travelMethod.toLocaleLowerCase().includes(filters.travelMethod.toLocaleLowerCase());
            const tourType = filters.tourType === "" || item.tourType.toLocaleLowerCase().includes(filters.tourType.toLocaleLowerCase());
            const difficulty = filters.difficulty === "" || item.difficulty.toLocaleLowerCase().includes(filters.difficulty);
            return places && travelMethod && tourType && difficulty;
        });
        updateFilteredObjects(filteredObjects);
    };

    return (
        <div className={classes.filter}>
            <select name="places" value={filters.places} onChange={handleFilterChange}>
                <option value='' disabled>Место пребывания</option>
                <option value="АП Минеральные Воды">АП Минеральные Воды</option>
                <option value="Термальный комплекс Жемчужина Кавказа">Термальный комплекс Жемчужина Кавказа</option>
                <option value="Архыз">Архыз</option>
                <option value="" >Показать все</option>
            </select>

            <select name="travelMethod" value={filters.travelMethod} onChange={handleFilterChange}>
                <option value="" disabled>Способ передвижения</option>
                <option value="Квадроцикл">Квадроцикл</option>
                <option value="Пеший">Пеший</option>
                <option value="Конный">Конный</option>
                <option value="Конно-пеший">Конно-пеший</option>
                <option value="Трансфер">Трансфер</option>
                <option value="Внедорожник">Внедорожник</option>
                <option value="" >Показать все</option>
            </select>

            <select name="tourType" value={filters.tourType} onChange={handleFilterChange}>
                <option value="" disabled>Тип поездки</option>
                <option value="Экстримальный">Экстримальный</option>
                <option value="Динамичный">Динамичный</option>
                <option value="Тематический">Тематический</option>
                <option value="Семейный">Семейный</option>
                <option value="Конные экскурсии">Конные экскурсии</option>
                <option value="Познавательный Туризм">Познавательный Туризм</option>
                <option value="" >Показать все</option>
            </select>

            <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
                <option value="" disabled>Сложность поездки</option>
                <option value="Высокая">Высокая</option>
                <option value="Средняя">Средняя</option>
                <option value="" >Показать все</option>
            </select>
        </div>
    );
}

export default Filter;
