import React from "react";
import classes from './AddOurTeam.module.css';
import Form from "../../Form/Form";

function AddOurTeam({ children, activeTab, setIsDirty, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>НАША КОМАНДА</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" setIsDirty={setIsDirty}>
                <label>Введите ФИО</label>
                <input name="fio" type="text" placeholder="Описание" required />

                <label>Введите краткое описание сотрудника</label>
                <input name="desc" type="text" placeholder="Описание" required />

                <label>Выберите фото сотрудника</label>
                <input type="file" name="employerPath" className={classes.noBorder} required />

                <button type="submit">Добавить сотрудника</button>
            </Form>
        </div>
    );
}

export default AddOurTeam;