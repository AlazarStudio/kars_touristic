import React from "react";
import classes from './AddTransfer.module.css';
import Form from "../../Form/Form";

function AddTransfer({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Трансфер</div>

            <Form actionUrl="http://localhost:5002/api/transfer" method="post" type={'query'}>
                <label>Введите заголовок</label>
                <input name="title" type="text" placeholder="Название" required />

                <label>Добавить краткое описание раздела</label>
                <textarea name="description" placeholder="Описание" required />
                
                <label>Введите ссылку на телеграмм</label>
                <input name="link" type="text" placeholder="@example" required />

                <button type="submit">Добавить трансфер</button>
            </Form>
        </div>
    );
}

export default AddTransfer;