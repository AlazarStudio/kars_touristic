import React from "react";
import classes from './NumberShow.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";

function NumberShow({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.numberInfo}>
                        <div className={classes.numberInfo_left}>
                            <div className={classes.numberInfo_left__slider}>
                                <img src="/numberSlide1.png" alt="" />
                            </div>
                            <div className={classes.numberInfo_left__desc}>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Площадь</p>
                                    <p>18-20 м2</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Кровать</p>
                                    <p>Двухспальная</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Дополнительно</p>
                                    <p>Кресло-кровать</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Уборка</p>
                                    <p>Ежедневно</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Смена белья</p>
                                    <p>Раз в три дня</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Питание</p>
                                    <p>Завтрак</p>
                                </div>
                                <div className={classes.numberInfo_left__desc___item}>
                                    <p>Вид</p>
                                    <p>На горы</p>
                                </div>
                            </div>
                        </div>
                        <div className={classes.numberInfo_right}>
                            <div className={classes.numberInfo_right__title}>
                                Двухместный полулюкс (двуспальный)
                            </div>
                            <div className={classes.numberInfo_right__desc}>
                                <p>Предлагаем Вам для размещения прекрасный номер с видом на окрестные горы величественного Кавказа. Номер площадью 18-20 квадратных метра позволит с комфортом разместиться 2 гостям, а если потребуется дополнительное место, то к Вашим услугам комфортное кресло кровать.</p>
                                <p>Мы постарались создать нашим гостям максимальное удобство и комфорт. Чтобы на время пребывания у нас Вы были сосредоточены только на отдыхе, мы предусмотрели все, что может Вам понадобиться. Все, от тапочек, до зубной щетки уже входит в стоимость номера, кроме того мы предлагаем нашим гостям завтраки, которые тоже включены в стоимость.</p>
                            </div>
                            <div className={classes.numberInfo_right__desc___items}>
                                <div className={classes.numberInfo_right__desc___items____block}>
                                    <div className={classes.numberInfo_right__desc___items____block_____title}>В номере:</div>
                                    <div className={classes.numberInfo_right__desc___items____block____elements}>
                                        <div><p><img src="/yes.png" alt="" /></p><span>телевизор 42 дюйма</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>стационарный телефон</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>электрический чайник</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>фен</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>холодильник</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>туалетный столик</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>душевая кабина</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>шкаф</span></div>
                                    </div>
                                </div>
                                <div className={classes.numberInfo_right__desc___items____block}>
                                    <div className={classes.numberInfo_right__desc___items____block_____title}>Принадлежности:</div>
                                    <div className={classes.numberInfo_right__desc___items____block____elements}>
                                        <div><p><img src="/yes.png" alt="" /></p><span>гель для душа</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>шампунь</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>мыло</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>щетка</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>паста</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>шапочка для душа</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>тапочки</span></div>
                                        <div><p><img src="/yes.png" alt="" /></p><span>халат</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CenterBlock>
                        <H2 text_transform="uppercase" margin="0 0 25px 0">Стоимость</H2>
                        <H2 font_weight="500" margin="0 0 50px 0">Цена меняется в зависимости от сезона. Обратите внимание на даты!</H2>
                        
                        <div className={classes.table}>
                            <div className={classes.table_row}>
                                <div className={classes.table_row__element}></div>
                                <div className={classes.table_row__element}>01.04.2023 по 30.06.2023</div>
                                <div className={classes.table_row__element}>01.07.2023 по 31.08.2023</div>
                                <div className={classes.table_row__element}>01.09.2023 по 20.11.2023</div>
                            </div>
                            <div className={classes.table_row}>
                                <div className={classes.table_row__element}>двухместное размещение</div>
                                <div className={classes.table_row__element}><b>6000</b></div>
                                <div className={classes.table_row__element}><b>6000</b></div>
                                <div className={classes.table_row__element}><b>6000</b></div>
                            </div>
                            <div className={classes.table_row}>
                                <div className={classes.table_row__element}>+ доп место</div>
                                <div className={classes.table_row__element}><b>1500</b></div>
                                <div className={classes.table_row__element}><b>3000</b></div>
                                <div className={classes.table_row__element}><b>1500</b></div>
                            </div>
                        </div>

                        <div className={classes.button}>Оставить заявку</div>
                    </CenterBlock>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default NumberShow;