import React from "react";
import classes from './AddTuragent.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddTuragent({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Турагентам</div>

            <Form actionUrl={`${server}/api/turagent`} method="post">
                <label>Введите описание</label>
                <textarea name="description" placeholder="Описание" required />

                <label>Загрузите Агентский договор</label>
                <input type="file" name="docPath" className={classes.noBorder} required />

                <button type="submit">Добавить</button>
            </Form>
        </div>
    );
}

export default AddTuragent;