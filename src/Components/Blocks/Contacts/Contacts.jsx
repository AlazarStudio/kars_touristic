import React from "react";
import classes from './Contacts.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import H2 from "../../Standart/H2/H2";
import Form from "../Form/Form";

import contacts_bg from "/contacts_bg.png";

import contacts_place from "/contacts_place.png";
import contacts_phone from "/contacts_phone.png";
import contacts_email from "/contacts_email.png";

function Contacts({ children, ...props }) {
    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <BlockTopInfo
                        topTitle={"Контакты"}
                        bgImg={contacts_bg}
                        mb={"40px"}
                        infoBlockData={[
                            {
                                icon: contacts_place,
                                title: "Наш адрес",
                                text: "аэропорт Минеральные Воды, кабинет 308",
                                link: "https://yandex.ru/maps/11063/mineralniye-vodi/?ll=43.082932%2C44.226136&mode=routes&rtext=~44.217803%2C43.087653&rtt=taxi&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D1039128967&z=14"
                            },
                            {
                                icon: contacts_phone,
                                title: "Телефон",
                                text: "+7 (800) 550-04-88",
                                link: "tel:+78005500488"
                            },
                            {
                                icon: contacts_email,
                                title: "E-mail",
                                text: "kars-touristic@mail.ru",
                                link: "mailto:kars-touristic@mail.ru"
                            }
                        ]}
                    />

                    <CenterBlock>
                        <H2>Если у Вас остались вопросы, оставьте заявку, мы свяжемся с Вами!</H2>

                        <Form/>
                    </CenterBlock>
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Contacts;