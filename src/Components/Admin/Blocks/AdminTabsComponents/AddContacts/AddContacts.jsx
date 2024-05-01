import React from "react";
import classes from './AddContacts.module.css';
import Form from "../../Form/Form";

function AddContacts({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Контакты</div>

            <Form actionUrl="http://localhost:5002/api/contacts" method="post" type={'query'}>
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