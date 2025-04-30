import React, { useState, useEffect } from "react";
import classes from './AddFAQ.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';
import Accordion from "../../../../Blocks/Accordion/Accordion";

function AddFAQ({ children, activeTab, ...props }) {
    const [faq, setFaq] = useState([]);

    useEffect(() => {
        async function fetchFaq() {
            try {
                const response = await fetch(`${server}/api/faq`);
                const data = await response.json();
                setFaq(data);
            } catch (error) {
                console.error("Error fetching faq info:", error);
            }
        }

        fetchFaq();
    }, []);

    async function handleFormSuccess() {
        try {
            const response = await fetch(`${server}/api/faq`);
            const data = await response.json();
            setFaq(data);
        } catch (error) {
            console.error("Error fetching faq info:", error);
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>FAQ</div>

            <Form actionUrl={`${server}/api/faq`} method="post" type={'query'} onSuccess={handleFormSuccess}>
                <label>Введите вопрос</label>
                <input name="question" type="text" placeholder="Название" required />

                <label>Введите ответ</label>
                <textarea name="answer" placeholder="Описание" required />

                <button type="submit">Добавить Вопрос</button>
            </Form>

            <br />
            {faq ? <div className={classes.addData_title}>Текущий FAQ</div> : null}
            {faq ? <Accordion items={faq} needDelete={true} onSuccess={handleFormSuccess}/>: null}

            
        </div>
    );
}

export default AddFAQ;