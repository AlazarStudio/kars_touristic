import React from "react";
import classes from './AddContacts.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddContacts({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Контакты</div>

            <Form actionUrl={`${server}/api/contacts`} method="post" type={'query'}>
                <label>Адрес</label>
                <input name="adress" type="text" placeholder="Адрес" required />

                <label>Телефон</label>
                <input name="phone" type="text" placeholder="Телефон" required />

                <label>Email</label>
                <input name="email" type="email" placeholder="Email" required />

                <button type="submit">Добавить контакты</button>
            </Form>
        </div>
    );
}

export default AddContacts;