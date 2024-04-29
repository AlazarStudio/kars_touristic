import React from "react";
import classes from './AddAboutCompany.module.css';
import Form from "../../Form/Form";

function AddAboutCompany({ children, activeTab, setIsDirty, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>О компании</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" setIsDirty={setIsDirty}>
                <label>Добавить краткое описание компании</label>
                <textarea name="description" placeholder="Описание" required />

                <button type="submit">Добавить описание компании</button>
            </Form>
        </div>
    );
}

export default AddAboutCompany;