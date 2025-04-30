import React, { useState } from "react";
import classes from './AddRoom.module.css';
import Form from "../../Form/Form";
import server from '../../../../../serverConfig';
import { useParams } from "react-router-dom";

function AddRoom({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    let { idToEdit } = useParams();

    const [checklists, setChecklists] = useState(['']);
    const [accessories, setAccessories] = useState(['']);
    const [photos, setPhotos] = useState([]);

    const handleAddChecklist = () => setChecklists([...checklists, '']);
    const handleAddAccessories = () => setAccessories([...accessories, '']);
    const handleFileChange = (event) => setPhotos([...photos, ...Array.from(event.target.files)]);

    const resetAll = () => {
        setChecklists(['']);
        setAccessories(['']);
        setPhotos([]);
    };

    const handleChecklistChange = (index, event) => {
        const newChecklists = [...checklists];
        newChecklists[index] = event.target.value;
        setChecklists(newChecklists);
    };
    const handleAccessoriesChange = (index, event) => {
        const newAccessories = [...accessories];
        newAccessories[index] = event.target.value;
        setAccessories(newAccessories);
    };

    function removeItemFromArray(array, index) {
        return array.filter((item, i) => i !== index);
    }

    const handleRemoveChecklist = index => {
        setChecklists(current => removeItemFromArray(current, index));
    };

    const handleRemoveAccessories = index => {
        setAccessories(current => removeItemFromArray(current, index));
    };

    const initialValues = {
        region, 
        'hotelID': idToEdit
    };

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>ДОБАВИТЬ Номер в Отель</div>

            <Form actionUrl={`${server}/api/addRooms`} method="post" needNavigate={true} resetAll={resetAll} initialValues={initialValues} onTourAdded={onTourAdded}>
                <label className={classes.addData_step}>Шаг 1</label>

                <div><input name="region" type="hidden" placeholder="Регион" required value={region} readOnly /></div>

                <label>Название номера</label>
                <input name="title" type="text" placeholder="Название номера" required />

                <label>Стоимость номера в сутки</label>
                <input name="price" type="text" placeholder="Стоимость номера" required />

                <label>Количество мест</label>
                <input name="places" type="text" placeholder="Количество мест" required />

                <label>Описание номера</label>
                <textarea name="description" type="text" placeholder="Описание номера" required ></textarea>


                <label className={classes.addData_step}>Шаг 2 - параметры номера</label>

                <label>Площадь</label>
                <input name="square" type="text" placeholder="Площадь" required />

                <label>Кровать</label>
                <input name="bed" type="text" placeholder="Кровать" required />

                <label>Дополнительно</label>
                <input name="additionally" type="text" placeholder="Дополнительно" required />

                <label>Уборка</label>
                <input name="cleaning" type="text" placeholder="Уборка" required />

                <label>Смена белья</label>
                <input name="changeOfLinen" type="text" placeholder="Смена белья" required />

                <label>Питание</label>
                <input name="food" type="text" placeholder="Питание" required />

                <label>Вид из окна</label>
                <input name="type" type="text" placeholder="Вид из окна" required />


                <label className={classes.addData_step}>Шаг 3</label>
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
                    Шаг 4 - Присутсвует в номере
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddChecklist}>+</div>
                </label>
                {checklists.map((checklist, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Объект {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`inRoom[${index}]`}
                                data-index={index}
                                placeholder={`Объект ${index + 1}`}
                                value={checklist}
                                onChange={(event) => handleChecklistChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveChecklist(index)}>-</div>
                        </div>
                    </div>
                ))}

                <label className={classes.addData_step}>
                    Шаг 5 - Принадлежности в номере
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddAccessories}>+</div>
                </label>
                {accessories.map((accessor, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Принадлежность {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`accessories[${index}]`}
                                data-index={index}
                                placeholder={`Принадлежность ${index + 1}`}
                                value={accessor}
                                onChange={(event) => handleAccessoriesChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveAccessories(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Добавить номер отеля</button>
            </Form>
        </div>
    );
}

export default AddRoom;
