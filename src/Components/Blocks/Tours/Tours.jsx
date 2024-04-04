import React from "react";
import classes from './Tours.module.css';
import Object from "../Object/Object";

function Tours({ children, ...props }) {
    let objects = [
        {
            img : "object_1.png",
            title : "«Нoвогодняя сказка Кавказа»",
            price : "От 10000 р.",
            priceImg : "priceImg.png",
        },
        {
            img : "object_2.png",
            title : "«Нoвогодние каникулы на Кавказе»",
            price : "От 10000 р.",
            priceImg : "priceImg.png",
        },
        {
            img : "object_3.png",
            title : "«Нoвогоднее путешествие по Кавказу»",
            price : "От 10000 р.",
            priceImg : "priceImg.png",
        },
    ]

    return (
        <>
            <div className={classes.fullBlock}>
                <div className={classes.filter}>
                    <select>
                        <option value="" disabled selected>Город</option>
                        <option value="Черкесск">Черкесск</option>
                        <option value="Карачаевск">Карачаевск</option>
                        <option value="Архыз">Архыз</option>
                        <option value="Домбай">Домбай</option>
                        <option value="Теберда">Теберда</option>
                    </select>
                    <select>
                        <option value="" disabled selected>Категория</option>
                        <option value="Детские">Детские</option>
                        <option value="Гастрономические">Гастрономические</option>
                        <option value="Конные">Конные</option>
                        <option value="Познавательные">Познавательные</option>
                        <option value="Религиозные">Религиозные</option>
                    </select>
                    <input type="date" />
                    <select>
                        <option value="Групповая поездка" selected>Групповая поездка</option>
                        <option value="Индивидуальная поездка">Индивидуальная поездка</option>
                        <option value="VIP">VIP</option>
                    </select>
                </div>

                <div className={classes.objects}>
                    {
                        objects.map((item, index) => (
                            <Object key={index} img={item.img} title={item.title} priceImg={item.priceImg} price={item.price} />
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Tours;