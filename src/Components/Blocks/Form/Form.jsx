import React from "react";
import classes from './Form.module.css';

function Form({ children, ...props }) {
    return (
        <>
            <form action="#" className={classes.form}>
                <div className={classes.form_title}>Обратная связь</div>

                <input type="text" placeholder="ФИО*" />
                <input type="text" placeholder="Телефон*" />
                <input type="text" placeholder="E-mail*" />
                <textarea placeholder="Коментарий"></textarea>
                <label>
                    <input type="radio" />
                    Отправляя форму, я даю согласие на обработку персональных данных, подтверждаю согласие с политикой конфиденциальности и условиями догов-оферты на оказание комлексных услуг, а также на получение информационных рассылок от проекта и партнеров проекта.
                </label>
                <button>Отправить</button>
            </form>
        </>
    );
}

export default Form;