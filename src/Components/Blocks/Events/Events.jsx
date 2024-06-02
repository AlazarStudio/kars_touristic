import React from "react";
import classes from './Events.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import Slider from "../Slider/Slider";
import H2 from "../../Standart/H2/H2";
import Map from "../Map/Map";

function Visits({ children, ...props }) {
    const info = [
        {
            img: 'galery1.png',
        },
        {
            img: 'galery2.png',
        },
        {
            img: 'galery3.png',
        },
        {
            img: 'galery1.png',
        },
        {
            img: 'galery2.png',
        },
        {
            img: 'galery3.png',
        },
    ]

    return (
        <>
            <CenterBlock>
                <div className={classes.visitMain} style={{ backgroundImage: `url(/airanEvent.jpg)` }}>
                    <H2 text_transform="uppercase" font_size="40px" color="var(--white_color)" zIndex="1">Праздник айрана</H2>
                    <a href="#" target="_blank" className={classes.placePoint}>
                        <img src="/placePoint.png" alt="" />
                        Медовые водопады
                    </a>
                </div>
                <WidthBlock>
                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">Праздник айрана</H2>
                        <div className={classes.textEvent}>
                            <p>
                                На «Медовых водопадах» в Карачаево-Черкесии отметили Праздник айрана. Традиционный Международный фестиваль карачаево-балкарской культуры прошел при поддержке Главы республики Рашида Темрезова в юбилейный десятый раз.
                            </p><p>
                                Программа этнофестиваля «Праздник айрана», собравшего около 5 тысяч гостей из разных регионов страны, была насыщенной. После официального открытия участников пригласили отведать айран, приготовленный по старинному национальному рецепту, из 500-литровой чаши.
                            </p><p>
                                «Отрадно, что в этом году десятый юбилейный фестиваль совпал со столетним юбилеем, который отмечает наша республика. Это весьма символично, и я надеюсь, что и фестиваль «Праздник айрана» также отметит свое столетие. Важно, что приезжая на этнофестиваль, гости из других регионов знакомятся с нашей самобытной богатой культурой, традициями, с людьми, которые здесь проживают, и, конечно, с природными красотами Карачаево-Черкесии», - отметил заместитель министра КЧР по делам национальностей, массовым коммуникациям и печати Ислам Хубиев.
                            </p><p>
                                В рамках фестиваля для гостей были организованы мастер-классы по изготовлению традиционного карачаевского айрана и балкарских и карачаевских хычинов, отведать которые мог каждый желающий. Кроме того, прошли выставки-ярмарки вязаных шерстяных изделий, кийизов, платков, национальной одежды, кузнечных изделий, карачаево-балкарских ножей (бычак).
                            </p><p>
                                Также гости фестиваля могли познакомиться с особенностями карачаево-балкарского быта – на фестивале были представлены несколько музейных экспозиций и частных коллекций. Праздничную атмосферу поддерживали яркие концертные номера национальных коллективов Карачаево-Черкесии и Кабардино-Балкарии.
                            </p><p>
                                «Этот фестиваль - крупное этническое мероприятие. Он не только дарит всем участникам хорошее настроение, но и способствует сохранению традиций, культуры, а также развивает туризм. Ежегодно в нем принимают участие несколько тысяч человек со всей страны. Сегодня, в условиях вызовов, которые стоят перед нашей страной, нам нужно объединиться, и подобные мероприятия в том числе способствуют этому» - поделился руководитель туркомплекса "Медовые водопады" Мусса Боташев.
                            </p><p>
                                По уже сложившейся традиции на фестивале состоялись различные народные забавы и конкурсы. Также был презентован ежегодный информационно-аналитический альманах "Karachayhorse", рассказывающий о лошадях карачаевской породы.
                            </p><p>
                                Отметим, «Праздник айрана» на «Медовых водопадах» проводится в Карачаево-Черкесии с 2012 года. Цель этнофестиваля - знакомство с многонациональной мультикультурностью нашей страны, сохранение национальных традиций, укрепление единства и всестороннее сближение народов, проживающих на территории РФ.
                            </p>
                        </div>
                    </CenterBlock>

                    <CenterBlock>
                        <H2 text_transform="uppercase" font_size="36px">ГАЛЕРЕЯ</H2>
                    </CenterBlock>

                    {/* <Slider info={info} boxShadow={'none'} loop={true} /> */}

                    <div className={classes.transfer} style={{ backgroundImage: `url(/transfer_bg_low.png)` }} >
                        <div className={classes.transfer_title}>Kars Drive</div>
                        <div className={classes.transfer_desc}>Заказать трансфер на ивент</div>
                        <a href="#" target="_blank" className={classes.placePoint}>
                            ЗАКАЗАТЬ  ТРАНСФЕР
                        </a>
                    </div>
                </WidthBlock>

                <Map
                    place='https://yandex.ru/map-widget/v1/?ll=42.587183%2C43.884185&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNDk5MDYxMjI4EpgB0KDQvtGB0YHQuNGPLCDQmtCw0YDQsNGH0LDQtdCy0L4t0KfQtdGA0LrQtdGB0YHQutCw0Y8g0KDQtdGB0L_Rg9Cx0LvQuNC60LAsINCc0LDQu9C-0LrQsNGA0LDRh9Cw0LXQstGB0LrQuNC5INGA0LDQudC-0L0sINCc0LXQtNC-0LLRi9C1INCS0L7QtNC-0L_QsNC00YsiCg1TWipCFcGJL0I%2C&z=18.52'
                />
            </CenterBlock>
        </>
    );
}

export default Visits;