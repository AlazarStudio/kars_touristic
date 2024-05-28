import React from "react";
import classes from './AddOurTeam.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddOurTeam({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>НАША КОМАНДА</div>

            <Form actionUrl={`${server}/api/team`} method="post">
                <label>Введите ФИО</label>
                <input name="name" type="text" placeholder="ФИО" required />

                <label>Введите краткое описание сотрудника</label>
                <input name="description" type="text" placeholder="Краткое описание сотрудника" required />

                <label>Выберите фото сотрудника</label>
                <input type="file" name="imgPath" className={classes.noBorder} required />

                <button type="submit">Добавить сотрудника</button>
            </Form>
        </div>
    );
}

export default AddOurTeam;