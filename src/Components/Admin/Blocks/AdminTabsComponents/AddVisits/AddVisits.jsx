import React, { useState } from "react";
import classes from './AddVisits.module.css';
import Form from "../../Form/Form";
import server from '../../../../../serverConfig';

function AddVisits({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const [items, setItems] = useState([{ title: '', description: '' }]);
    const [checklists, setChecklists] = useState(['']);
    const [days, setDays] = useState(['']);
    const [photos, setPhotos] = useState([]);

    const handleAddItem = () => setItems([...items, { title: '', description: '' }]);
    const handleAddChecklist = () => setChecklists([...checklists, '']);
    const handleAddDay = () => setDays([...days, '']);
    const handleFileChange = (event) => setPhotos([...photos, ...Array.from(event.target.files)]);

    const resetAll = () => {
        setItems([{ title: '', description: '' }]);
        setChecklists(['']);
        setDays(['']);
        setPhotos([]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
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

    const handleRemoveItem = index => {
        setItems(current => removeItemFromArray(current, index));
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
            <div className={classes.addData_title}>ДОБАВИТЬ Место</div>

            <Form actionUrl={`${server}/api/addPlaces`} method="post" needNavigate={true} resetAll={resetAll} initialValues={initialValues} onTourAdded={onTourAdded}>
                <label className={classes.addData_step}>Шаг 1</label>

                <div><input name="region" type="hidden" placeholder="Регион" required value={region} readOnly /></div>

                <label>Название места</label>
                <input name="title" type="text" placeholder="Название места" required />

                <label>Описание отеля</label>
                <textarea name="description" type="text" placeholder="Описание места" required ></textarea>

                <label>Ссылка из яндекс карт на место</label>
                <input name="mapLink" type="text" placeholder="Ссылка из яндекс карт на место" required />

                <label className={classes.addData_step}>Шаг 2</label>
                <label>Загрузите фотографии для галереи</label>
                <input
                    type="file"
                    name="photos"
                    className={classes.noBorder} 
                    multiple
                    onChange={handleFileChange}
                    required
                />

                <label className={classes.addData_step}>
                    Шаг 3 (Факты)
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddItem}>+</div>
                </label>
                {items.map((item, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Факт {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <div className={classes.add_moreData}>
                                <input
                                    type="text"
                                    name={`placeItems[${index}][title]`}
                                    data-index={index}
                                    placeholder={`Название факта ${index + 1}`}
                                    value={item.title}
                                    onChange={(event) => handleItemChange(index, 'title', event.target.value)}
                                    required
                                />
                                <textarea
                                    name={`placeItems[${index}][description]`}
                                    data-index={index}
                                    placeholder={`Описание факта ${index + 1}`}
                                    value={item.description}
                                    onChange={(event) => handleItemChange(index, 'description', event.target.value)}
                                    required
                                />
                            </div>
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveItem(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Добавить место</button>
            </Form>
        </div>
    );
}

export default AddVisits;
