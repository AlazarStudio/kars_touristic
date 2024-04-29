import React from "react";
import classes from './AddFAQ.module.css';
import Form from "../../Form/Form";

function AddFAQ({ children, activeTab, setIsDirty, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>FAQ</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" setIsDirty={setIsDirty}>
                <label>Введите вопрос</label>
                <input name="question" type="text" placeholder="Название" required />

                <label>Введите ответ</label>
                <textarea name="answer" placeholder="Описание" required />

                <button type="submit">Добавить Вопрос</button>
            </Form>
        </div>
    );
}

export default AddFAQ;