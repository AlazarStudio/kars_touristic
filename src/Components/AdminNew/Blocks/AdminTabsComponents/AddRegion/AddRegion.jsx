import React from "react";
import classes from './AddRegion.module.css';
import Form from "../../Form/Form";
import server from '../../../../../serverConfig';

function AddRegion({ children, activeTab, fetchRegions, ...props }) {
    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>ДОБАВИТЬ РЕГИОН</div>

            <Form actionUrl={`${server}/api/addRegion`} method="post" fetchRegions={fetchRegions}>
                <label>Введите название региона</label>
                <input name="title" type="text" placeholder="Название" required />

                <label>Добавить описание 1</label>
                <textarea name="description" placeholder="Описание" required />

                <label>Добавить описание 2</label>
                <textarea name="descriptionSecond" placeholder="Описание" required />

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