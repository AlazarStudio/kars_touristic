import React, { useState, useEffect } from "react";
import classes from './AddOurTeam.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddOurTeam({ children, activeTab, ...props }) {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        async function fetchTeamMembers() {
            try {
                const response = await fetch(`${server}/api/getTeam`);
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        }

        fetchTeamMembers();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/getTeam`);
            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            console.error("Error fetching company info:", error);
        }
    }


    const deleteElement = async (id) => {
        try {
            await fetch(`${server}/api/deleteTeam/${id}`, {
                method: 'DELETE'
            });
            // Обновим состояние после удаления элемента
            setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
        }

        handleFormSuccess()
    };

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>НАША КОМАНДА</div>

            <Form actionUrl={`${server}/api/team`} method="post" onSuccess={handleFormSuccess}>
                <label>Введите ФИО</label>
                <input name="name" type="text" placeholder="ФИО" required />

                <label>Введите краткое описание сотрудника</label>
                <input name="description" type="text" placeholder="Краткое описание сотрудника" required />

                <label>Выберите фото сотрудника</label>
                <input type="file" name="imgPath" className={classes.noBorder} required />

                <button type="submit">Добавить сотрудника</button>
            </Form>

            <br />
            <div className={classes.addData_title}>Добавленная КОМАНДА</div>

            <div className={classes.teamList}>
                {teamMembers.length > 0 ? (
                    teamMembers.map((member, index) => (
                        <div key={index} className={classes.teamMember}>
                            <div className={classes.teamMember_img}>
                                <img src={`${server}/refs/${member.imgPath}`} alt={member.name} />
                            </div>
                            <div className={classes.teamMemberInfo}>
                                <h3>{member.name}</h3>
                                <p>{member.description}</p>
                            </div>
                            <div className={classes.teamMemberDelete} onClick={() => deleteElement(member._id)}>
                                Удалить
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Команда пока пуста</p>
                )}
            </div>
        </div>
    );
}

export default AddOurTeam;