import React, { useState } from "react";
import classes from './AddHotels.module.css';
import Form from "../../Form/Form";

import server from '../../../../../serverConfig';

function AddHotels({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const [places, setPlaces] = useState(['']);
    const [checklists, setChecklists] = useState(['']);
    const [days, setDays] = useState(['']);
    const [photos, setPhotos] = useState([]);

    const handleAddPlace = () => setPlaces([...places, '']);
    const handleAddChecklist = () => setChecklists([...checklists, '']);
    const handleAddDay = () => setDays([...days, '']);
    const handleFileChange = (event) => setPhotos([...photos, ...Array.from(event.target.files)]);

    const resetAll = () => {
        setPlaces(['']);
        setChecklists(['']);
        setDays(['']);
        setPhotos([]);
    };

    const handlePlaceChange = (index, event) => {
        const newPlaces = [...places];
        newPlaces[index] = event.target.value;
        setPlaces(newPlaces);
    };

    const handleChecklistChange = (index, event) => {
        const newChecklists = [...checklists];
        newChecklists[index] = event.target.value;
        setChecklists(newChecklists);
    };

    const handleDayChange = (index, event) => {
        const newDays = [...days];
        newDays[index] = event.target.value;
        setDays(newDays);
    };

    function removeItemFromArray(array, index) {
        return array.filter((item, i) => i !== index);
    }

    const handleRemovePlace = index => {
        setPlaces(current => removeItemFromArray(current, index));
    };

    const handleRemoveChecklist = index => {
        setChecklists(current => removeItemFromArray(current, index));
    };

    const handleRemoveDay = index => {
        setDays(current => removeItemFromArray(current, index));
    };

    const initialValues = {
        region
    };

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>ДОБАВИТЬ Отель</div> 

            <Form actionUrl={`${server}/api/addHotels`} method="post" needNavigate={true} resetAll={resetAll} initialValues={initialValues} onTourAdded={onTourAdded}>
                <label className={classes.addData_step}>Шаг 1</label>

                <div><input name="region" type="hidden" placeholder="Регион" required value={region} readOnly /></div>

                <label>Название отеля</label>
                <input name="title" type="text" placeholder="Название отеля" required />

                <label>Количество звезд у отеля</label>
                <input name="stars" type="number" placeholder="Количество звезд у отеля" required />

                <label>Описание отеля</label>
                <textarea name="description" type="text" placeholder="Описание отеля" required ></textarea>

                <label>Дополнительная информация</label>
                <textarea name="moreInfo" type="text" placeholder="Дополнительная информация" required ></textarea>


                <label className={classes.addData_step}>Шаг 2</label>
                <label>Загрузите фотографии для галереи</label>
                <input
                    type="file"
                    name="galery"
                    className={classes.noBorder}
                    multiple
                    onChange={handleFileChange}
                    required
                />

                {/* Третий этап - Места */}
                <label className={classes.addData_step}>
                    Шаг 3 (Удобства)
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddPlace}>+</div>
                </label>
                {places.map((place, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Удобство {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`items[]`}
                                data-index={index}
                                placeholder={`Удобство ${index + 1}`}
                                value={place}
                                onChange={(event) => handlePlaceChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemovePlace(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Четвертый этап - Чек-листы */}
                <label className={classes.addData_step}>
                    Шаг 4 (Ссылки на соц сети)
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddChecklist}>+</div>
                </label>
                {checklists.map((checklist, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Ссылка на соц сеть {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`links[]`}
                                data-index={index}
                                placeholder={`Ссылка на соц сеть ${index + 1}`}
                                value={checklist}
                                onChange={(event) => handleChecklistChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveChecklist(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Добавить Отель</button>
            </Form>
        </div>
    );
}

export default AddHotels;