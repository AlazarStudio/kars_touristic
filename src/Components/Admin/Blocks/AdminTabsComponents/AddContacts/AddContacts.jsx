import React, { useEffect, useState } from "react";
import classes from './AddContacts.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';
import BlockTopInfo from "../../../../Blocks/BlockTopInfo/BlockTopInfo";
import contacts_bg from "/contacts_bg.png";

import contacts_place from "/contacts_place.png";
import contacts_phone from "/contacts_phone.png";
import contacts_email from "/contacts_email.png";
function AddContacts({ children, activeTab, ...props }) {
    const [contactsInfo, setContactsInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/contacts`);
                const data = await response.json();
                setContactsInfo(data);
            } catch (error) {
                console.error("Error fetching contacts info:", error);
            }
        }

        fetchMissionInfo();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/contacts`);
            const data = await response.json();
            setContactsInfo(data);
        } catch (error) {
            console.error("Error fetching contacts info after form submission:", error);
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Контакты</div>

            <Form actionUrl={`${server}/api/contacts`} method="put" type={'query'} onSuccess={handleFormSuccess}>
                <label>Адрес</label>
                <input name="adress" type="text" placeholder="Адрес"  />

                <label>Телефон</label>
                <input name="phone" type="text" placeholder="Телефон"  />

                <label>Email</label>
                <input name="email" type="email" placeholder="Email"  />

                <button type="submit">Добавить контакты</button>
            </Form>

            <br />
            {contactsInfo ? <div className={classes.addData_title}>Текущие контакты:</div> : null}

            {contactsInfo ?

                <BlockTopInfo
                    topTitle={"Контакты"}
                    bgImg={contacts_bg}
                    mb={"40px"}
                    infoBlockData={[
                        {
                            icon: contacts_place,
                            title: "Наш адрес",
                            text: contactsInfo.adress,
                            link: "https://yandex.ru/maps/11063/mineralniye-vodi/?ll=43.082932%2C44.226136&mode=routes&rtext=~44.217803%2C43.087653&rtt=taxi&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D1039128967&z=14"
                        },
                        {
                            icon: contacts_phone,
                            title: "Телефон",
                            text: contactsInfo.phone,
                            link: `tel:${contactsInfo.phone}`
                        },
                        {
                            icon: contacts_email,
                            title: "E-mail",
                            text: contactsInfo.email,
                            link: `mailto:${contactsInfo.email}`
                        }
                    ]}
                />

                : null}
        </div>
    );
}

export default AddContacts;