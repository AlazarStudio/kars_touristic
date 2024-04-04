import React, { useState } from "react";
import classes from './Tours.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";

function Tours({ children, ...props }) {
    let objects = [
        {
            img: "object_1.png",
            title: "«Нoвогодняя сказка Кавказа»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Черкесск",
            category: "Познавательные",
            date: "2024-04-05",
            tripType: "Групповая поездка"
        },
        {
            img: "object_2.png",
            title: "«Нoвогодние каникулы на Кавказе»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Карачаевск",
            category: "Гастрономические",
            date: "2024-04-06",
            tripType: "Индивидуальная поездка"
        },
        {
            img: "object_3.png",
            title: "«Нoвогоднее путешествие по Кавказу»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Архыз",
            category: "Конные",
            date: "2024-04-05",
            tripType: "Индивидуальная поездка"
        },
        {
            img: "object_1.png",
            title: "«Нoвогодняя сказка Кавказа»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Черкесск",
            category: "Познавательные",
            date: "2024-04-05",
            tripType: "Групповая поездка"
        },
        {
            img: "object_2.png",
            title: "«Нoвогодние каникулы на Кавказе»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Карачаевск",
            category: "Гастрономические",
            date: "2024-04-06",
            tripType: "Индивидуальная поездка"
        },
        {
            img: "object_3.png",
            title: "«Нoвогоднее путешествие по Кавказу»",
            price: "От 10000 р.",
            priceImg: "priceImg.png",
            city: "Архыз",
            category: "Конные",
            date: "2024-04-05",
            tripType: "Индивидуальная поездка"
        },
    ]

    const [filters, setFilters] = useState({
        city: "",
        category: "",
        date: "",
        tripType: ""
    });

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value === "Показать все" ? "" : value
        }));
    };

    const filteredObjects = objects.filter((item) => {
        const cityMatch = filters.city === "" || item.city === filters.city;
        const categoryMatch = filters.category === "" || item.category === filters.category;
        const dateMatch = filters.date === "" || item.date === filters.date;
        const tripTypeMatch = filters.tripType === "" || item.tripType === filters.tripType;
        return cityMatch && categoryMatch && dateMatch && tripTypeMatch;
    });

    return (
        <>
            <div className={classes.fullBlock}>
                <Filter filters={filters} handleFilterChange={handleFilterChange}/>

                <div className={classes.objects}>
                    {
                        filteredObjects.map((item, index) => (
                            <Object key={index} img={item.img} title={item.title} priceImg={item.priceImg} price={item.price} />
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Tours;