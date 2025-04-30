import React, { useEffect, useState } from "react";
import classes from './AddTuragent.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddTuragent({ children, activeTab, ...props }) {
    const [turagentInfo, setTuragentInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/turagent`);
                const data = await response.json();
                setTuragentInfo(data);
            } catch (error) {
                console.error("Error fetching turagent info:", error);
            }
        }

        fetchMissionInfo();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/turagent`);
            const data = await response.json();
            setTuragentInfo(data);
        } catch (error) {
            console.error("Error fetching turagent info after form submission:", error);
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Авторам туров</div>
            {turagentInfo && (
                <div className={classes.turagentInfo}>
                    <h3>Описание для авторов туров:</h3>
                    <p>{turagentInfo.description}</p>
                    <br />
                    <h3>Файл авторам туров: <a href={`${server}/refs/${turagentInfo.docPath}`} target="_blank"> Скачать файл</a>
                    </h3>
                </div>
            )}
            <Form actionUrl={`${server}/api/turagent`} method="put" onSuccess={handleFormSuccess}>
                <label>Введите описание</label>
                <textarea name="description" placeholder="Описание" required />

                <label>Загрузите Агентский договор</label>
                <input type="file" name="docPath" className={classes.noBorder} required />

                <button type="submit">Добавить</button>
            </Form>

            <br />

        </div>
    );
}

export default AddTuragent;