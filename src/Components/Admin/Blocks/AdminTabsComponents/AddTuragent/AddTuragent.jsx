import React from "react";
import classes from './AddTuragent.module.css';
import Form from "../../Form/Form";

function AddTuragent({ children, activeTab, setIsDirty, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Турагентам</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" setIsDirty={setIsDirty}>
                <label>Введите описание</label>
                <textarea name="description" placeholder="Описание" required />

                <label>Загрузите Агентский договор</label>
                <input type="file" name="dogovorPath" className={classes.noBorder} required />

                <button type="submit">Добавить</button>
            </Form>
        </div>
    );
}

export default AddTuragent;