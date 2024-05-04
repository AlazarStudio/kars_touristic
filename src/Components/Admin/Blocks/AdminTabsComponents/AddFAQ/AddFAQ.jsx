import React from "react";
import classes from './AddFAQ.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddFAQ({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>FAQ</div>

            <Form actionUrl={`${server}/api/faq`} method="post" type={'query'}>
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