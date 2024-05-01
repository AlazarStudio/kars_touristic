import React from "react";
import classes from './AddAboutCompany.module.css';
import Form from "../../Form/Form";

function AddAboutCompany({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>О компании</div>

            <Form actionUrl="http://localhost:5002/api/aboutCompany" method="post" type={'query'}>
                <label>Добавить краткое описание компании</label>
                <textarea name="aboutCompany" placeholder="Описание" required />

                <button type="submit">Добавить описание компании</button>
            </Form>
        </div>
    );
}

export default AddAboutCompany;