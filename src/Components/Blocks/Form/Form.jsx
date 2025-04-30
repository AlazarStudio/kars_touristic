import React, { useState } from "react";
import axios from 'axios';
import classes from './Form.module.css';

function Form({ children, ...props }) {
    const [form, setForm] = useState({
        fio: '',
        phone: '',
        email: '',
        subject: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // ----------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/php/send_mail.php', new URLSearchParams(form));
            alert(response.data);
            setForm({
                fio: '',
                phone: '',
                email: '',
                subject: '',
                comment: ''
            });
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            alert('Произошла ошибка при отправке сообщения.');
        }
    };

    // ----------------------------------------------------------------

    return (
        <>
            <form onSubmit={handleSubmit} className={classes.form}>
                <input type="text" placeholder="ФИО*" name="fio" value={form.fio} onChange={handleChange} required />

                <input type="tel" placeholder="Телефон*" name="phone" value={form.phone} onChange={handleChange} required />

                <input type="email" placeholder="E-mail*" name="email" value={form.email} onChange={handleChange} required />

                <select name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="" disabled>Суть обращения</option>
                    <option value="complaint">Жалоба</option>
                    <option value="suggestion">Предложение</option>
                    <option value="question">Вопрос</option>
                </select>

                <textarea name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange}></textarea>

                <div className={classes.formFeedback_check}>
                    <label>
                        <input type="checkbox" required />
                        <div>
                            Отправляя форму, я даю согласие на обработку персональных данных, подтверждаю согласие с политикой конфиденциальности и условиями догов-оферты на оказание комлексных услуг, а также на получение информационных рассылок от проекта и партнеров проекта.
                        </div>
                    </label>
                </div>

                <button type="submit">Отправить</button>
            </form>
        </>
    );
}

export default Form;