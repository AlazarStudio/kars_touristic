import React from "react";
import classes from './Tours.module.css';

function Tours({ children, ...props }) {
    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + '...';
        }
        return str;
    }
    return (
        <>
            <div className={classes.fullBlock}>
                <div className={classes.filter}>
                    <select>
                        <option value="" disabled defaultValue>Город</option>
                        <option value="Черкесск">Черкесск</option>
                        <option value="Карачаевск">Карачаевск</option>
                        <option value="Архыз">Архыз</option>
                        <option value="Домбай">Домбай</option>
                        <option value="Теберда">Теберда</option>
                    </select>
                    <select>
                        <option value="" disabled defaultValue>Категория</option>
                        <option value="Детские">Детские</option>
                        <option value="Гастрономические">Гастрономические</option>
                        <option value="Конные">Конные</option>
                        <option value="Познавательные">Познавательные</option>
                        <option value="Религиозные">Религиозные</option>
                    </select>
                    <input type="date" />
                    <select>
                        <option value="Групповая поездка" defaultValue>Групповая поездка</option>
                        <option value="Индивидуальная поездка">Индивидуальная поездка</option>
                        <option value="VIP">VIP</option>
                    </select>
                </div>

                <div className={classes.objects}>
                    <div className={classes.objects_item}>
                        <div className={classes.objects_item__img}>
                            <img src="/object_1.png" alt="" />
                        </div>
                        <div className={classes.objects_item__bottom}>
                            <div className={classes.objects_item__title}>
                                {truncateString("«Нoвогодняя сказка Кавказа»", 35)}
                            </div>
                            <div className={classes.objects_item__price}>
                                <img src="/priceImg.png" alt="" />
                                От 10000 р.
                            </div>
                            <div className={classes.objects_item__button}>Подробнее</div>
                        </div>
                    </div>
                    <div className={classes.objects_item}>
                        <div className={classes.objects_item__img}>
                            <img src="/object_2.png" alt="" />
                        </div>
                        <div className={classes.objects_item__bottom}>
                            <div className={classes.objects_item__title}>
                                {truncateString("«Нoвогодние каникулы на Кавказе»", 35)}
                            </div>
                            <div className={classes.objects_item__price}>
                                <img src="/priceImg.png" alt="" />
                                От 10000 р.
                            </div>
                            <div className={classes.objects_item__button}>Подробнее</div>
                        </div>
                    </div>
                    <div className={classes.objects_item}>
                        <div className={classes.objects_item__img}>
                            <img src="/object_3.png" alt="" />
                        </div>
                        <div className={classes.objects_item__bottom}>
                            <div className={classes.objects_item__title}>
                                {truncateString("«Нoвогоднее путешествие по Кавказу»", 34)}
                            </div>
                            <div className={classes.objects_item__price}>
                                <img src="/priceImg.png" alt="" />
                                От 10000 р.
                            </div>
                            <div className={classes.objects_item__button}>Подробнее</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tours;