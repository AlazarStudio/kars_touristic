import React from "react";
import classes from './AddRegion.module.css';
import Form from "../../Form/Form";

function AddRegion({ children, activeTab, fetchRegions, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>ДОБАВИТЬ РЕГИОН</div>

            <Form actionUrl="http://localhost:5002/api/addRegion" method="post" fetchRegions={fetchRegions}>
                <label>Введите название региона</label>
                <input name="title" type="text" placeholder="Название" required />

                <label>Добавить описание</label>
                <textarea name="description" placeholder="Описание" required />

                <label>Загрузите иконку для региона</label>
                <input type="file" name="iconPath" className={classes.noBorder} required />

                <label>Загрузите фото для обложки региона (на главной) </label>
                <input type="file" name="coverImgPath" className={classes.noBorder} required />

                <label>Загрузите фото для фона региона</label>
                <input type="file" name="backgroundImgPath" className={classes.noBorder} required />
                
                <button type="submit">Добавить регион</button>
            </Form>
        </div>
    );
}

export default AddRegion;