import React from "react";
import classes from './AddVisits.module.css';
import Form from "../../Form/Form";

function AddVisits({ children, activeTab, fetchRegions, setIsDirty, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>ДОБАВИТЬ Место</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" fetchRegions={fetchRegions} setIsDirty={setIsDirty}>
                
                <label className={classes.addData_step}>Первый этап</label>

                <label>Название тура</label>
                <input name="title" type="text" placeholder="Название тура" required />

                <label>Cпособ передвижения</label>
                <input name="title" type="text" placeholder="Cпособ передвижения" required />

                <label>Продолжительность</label>
                <input name="title" type="text" placeholder="Продолжительность" required />

                <label>Время отправления</label>
                <input name="title" type="text" placeholder="Время отправления" required />

                <label>Тип экскурсии</label>
                <input name="title" type="text" placeholder="Тип экскурсии" required />

                <label>Сложность</label>
                <input name="title" type="text" placeholder="Сложность" required />

                <label>Стоимость</label>
                <input name="title" type="text" placeholder="Стоимость" required />



                <label className={classes.addData_step}>Второй этап</label>

                <label>Загрузите фотографии для слайдера</label>
                <input type="file" name="iconPath" className={classes.noBorder} required />



                <label className={classes.addData_step}>Третий этап</label>

                <label>Место 1</label>
                <input name="title" type="text" placeholder="Место 1" required />

                <label>Место 2</label>
                <input name="title" type="text" placeholder="Место 2" required />

                <label>Место 3</label>
                <input name="title" type="text" placeholder="Место 3" required />

                <label>Место 4</label>
                <input name="title" type="text" placeholder="Место 4" required />

                <label>Место 5</label>
                <input name="title" type="text" placeholder="Место 5" required />

                <label>Место 6</label>
                <input name="title" type="text" placeholder="Место 6" required />



                <label className={classes.addData_step}>Четвертый этап</label>

                <label>Чек-лист 1</label>
                <input name="title" type="text" placeholder="Чек-лист 1" required />

                <label>Чек-лист 2</label>
                <input name="title" type="text" placeholder="Чек-лист 2" required />

                <label>Чек-лист 3</label>
                <input name="title" type="text" placeholder="Чек-лист 3" required />

                <label>Чек-лист 4</label>
                <input name="title" type="text" placeholder="Чек-лист 4" required />



                <label className={classes.addData_step}>Пятый этап</label>

                <label>Описание</label>
                <textarea name="description" placeholder="Описание" required />

                
                <button type="submit">Добавить Тур</button>
            </Form>
        </div>
    );
}

export default AddVisits;