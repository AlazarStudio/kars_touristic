import React from "react";
import classes from './AddOurMission.module.css';
import Form from "../../Form/Form";

function AddOurMission({ children, activeTab, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Наша миссия</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post">
                <label>Добавить описание миссии</label>
                <textarea name="description" placeholder="Описание" required />

                <button type="submit">Добавить миссию комании</button>
            </Form>
        </div>
    );
}

export default AddOurMission;