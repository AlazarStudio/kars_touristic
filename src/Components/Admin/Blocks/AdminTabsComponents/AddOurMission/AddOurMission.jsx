import React, { useEffect, useState } from "react";
import classes from './AddOurMission.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddOurMission({ children, activeTab, ...props }) {
    const [missionInfo, setMissionInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/mission`);
                const data = await response.json();
                setMissionInfo(data.mission);
            } catch (error) {
                console.error("Error fetching mission info:", error);
            }
        }

        fetchMissionInfo();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/mission`);
            const data = await response.json();
            setMissionInfo(data.mission);
        } catch (error) {
            console.error("Error fetching mission info after form submission:", error);
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Наша миссия</div>
            
            {missionInfo && (
                <div className={classes.missionInfo}>
                    <h3>Текущее описание миссии:</h3>
                    <p>{missionInfo}</p>
                </div>
            )}

            <Form actionUrl={`${server}/api/mission`} method="put" type={'query'} onSuccess={handleFormSuccess}>
                <label>Добавить описание миссии</label>
                <textarea name="mission" placeholder="Описание" required />

                <button type="submit">Добавить миссию компании</button>
            </Form>
        </div>
    );
}

export default AddOurMission;
