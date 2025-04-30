import React, { useState } from "react";
import classes from './AddHotels.module.css';
import Form from "../../Form/Form";
import server from '../../../../../serverConfig';

function AddHotels({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const [items, setItems] = useState([{ title: '', description: '' }]);
    const [checklists, setChecklists] = useState(['']);
    const [days, setDays] = useState(['']);
    const [photos, setPhotos] = useState([]);
    const [type, setType] = useState(''); // Добавлен стейт для типа

    const handleAddItem = () => setItems([...items, { title: '', description: '' }]);
    const handleAddChecklist = () => setChecklists([...checklists, '']);
    const handleAddDay = () => setDays([...days, '']);
    const handleFileChange = (event) => setPhotos([...photos, ...Array.from(event.target.files)]);

    const handleTypeChange = (event) => {
        setType(event.target.value); // Обновление стейта при изменении типа
    };

    const resetAll = () => {
        setItems([{ title: '', description: '' }]);
        setChecklists(['']);
        setDays(['']);
        setPhotos([]);
        setType(''); // Сброс типа при сбросе всех данных
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
            <div className={classes.addData_title}>ДОБАВИТЬ Отель / Апартамент</div>

            <Form actionUrl={`${server}/api/addHotels`} method="post" needNavigate={true} resetAll={resetAll} initialValues={initialValues} onTourAdded={onTourAdded}>
                <label className={classes.addData_step}>Шаг 1</label>

                <div><input name="region" type="hidden" placeholder="Регион" required value={region} readOnly /></div>
                
                <div className={classes.selectedTypeData}>
                    <label>Тип </label>
                    <select name="type" required onChange={handleTypeChange}>
                        <option value="">Выберите тип</option>
                        <option value="hotel">Отель</option>
                        <option value="apartments">Апартаменты</option>
                    </select>

                    {type === "apartments" && (
                        <>
                            <label>Стоимость в сутки</label>
                            <input name="price" type="text" placeholder="Стоимость" required />

                            <label>Количество мест</label>
                            <input name="places" type="text" placeholder="Количество мест" required />
                        </>
                    )}
                </div>

                <label>Название</label>
                <input name="title" type="text" placeholder="Название" required />

                <label>Город</label>
                <input name="city" type="text" placeholder="Город" required />

                <label>Адрес</label>
                <input name="adress" type="text" placeholder="Адрес" required />

                <label>Количество звезд</label>
                <input name="stars" type="number" placeholder="Количество звезд у" required />

                <label>Описание</label>
                <textarea name="description" type="text" placeholder="Описание" required ></textarea>

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

                <label className={classes.addData_step}>
                    Шаг 3 (Удобства)
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddItem}>+</div>
                </label>
                {items.map((item, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Удобство {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <div className={classes.add_moreData}>
                                <input
                                    type="text"
                                    name={`items[${index}][title]`}
                                    data-index={index}
                                    placeholder={`Название удобства ${index + 1}`}
                                    value={item.title}
                                    onChange={(event) => handleItemChange(index, 'title', event.target.value)}
                                    required
                                />
                                <textarea
                                    name={`items[${index}][description]`}
                                    data-index={index}
                                    placeholder={`Описание удобства ${index + 1}`}
                                    value={item.description}
                                    onChange={(event) => handleItemChange(index, 'description', event.target.value)}
                                    required
                                />
                            </div>
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveItem(index)}>-</div>
                        </div>
                    </div>
                ))}

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
                                name={`links[${index}]`}
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
