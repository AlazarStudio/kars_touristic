import React, { useEffect, useState }  from "react";
import classes from './AddTransfer.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';
import Transfer from "../../../../Blocks/Transfer/Transfer";

function AddTransfer({ children, activeTab, ...props }) {
    const [transferInfo, setTransferInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/transfer`);
                const data = await response.json();
                setTransferInfo(data);
            } catch (error) {
                console.error("Error fetching transfer info:", error);
            }
        }

        fetchMissionInfo();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/transfer`);
            const data = await response.json();
            setTransferInfo(data);
        } catch (error) {
            console.error("Error fetching transfer info after form submission:", error);
        }
    }

    console.log(transferInfo);

    return (
        <div className={classes.addData}>
            
            <div className={classes.addData_title}>Трансфер</div>

            <Form actionUrl={`${server}/api/transfer`} method="put" type={'query'}  onSuccess={handleFormSuccess}>
                <label>Введите заголовок</label>
                <input name="title" type="text" placeholder="Название"  />

                <label>Добавить краткое описание раздела</label>
                <textarea name="description" placeholder="Описание"  />
                
                <label>Введите ссылку на телеграмм</label>
                <input name="link" type="text" placeholder="https://t.me/username"  />

                <button type="submit">Добавить трансфер</button>
            </Form>

            {transferInfo ? <div className={classes.addData_title}>Текущий трансфер:</div> : null}

            {transferInfo ? <Transfer data={transferInfo}/> : null}
        </div>
    );
}

export default AddTransfer;