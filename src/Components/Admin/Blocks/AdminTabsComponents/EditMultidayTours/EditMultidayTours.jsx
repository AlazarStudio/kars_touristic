import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import classes from './EditMultidayTours.module.css';
import Form from "../../Form/Form";

function EditMultidayTours({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const { idToEdit } = useParams();

    const [selectedTour, setSelectedTour] = useState({
        tourTitle: '',
        travelMethod: '',
        duration: '',
        departureTime: '',
        tourType: '',
        difficulty: '',
        cost: ''
    });

    const fetchTourById = (id) => {
        fetch(`http://localhost:5002/api/getOneMultidayTour/${id}`)
            .then(response => response.json())
            .then(data => {
                // Убедитесь, что полученные данные - это объект
                if (data && typeof data === 'object') {
                    setSelectedTour(data);
                } else {
                    console.error('Received data is not an object:', data);
                }
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => {
        if (idToEdit) {
            fetchTourById(idToEdit);
        }
    }, [idToEdit]);

    useEffect(() => {
        if (selectedTour) {
            setPlaces(selectedTour.places || ['']);
            setChecklists(selectedTour.checklists || ['']);
            setDays(selectedTour.days || ['']);
            setPhotos(selectedTour.photos || []);
        }
    }, [selectedTour]);

    const [places, setPlaces] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [days, setDays] = useState([]);
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
        region,
        ...selectedTour
    };

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Изменить Многодневный тур</div>

            <Form actionUrl="http://localhost:5002/api/addMultidayTour" method="post" resetAll={resetAll} initialValues={initialValues} onTourAdded={onTourAdded}>
                <label className={classes.addData_step}>Первый этап</label>

                <input name="region" type="text" placeholder="Регион" required value={region} readOnly />

                <label>Название тура </label>
                <input name="tourTitle" type="text" placeholder="Название тура" value={selectedTour.tourTitle} required />

                <label>Cпособ передвижения</label>
                <input name="travelMethod" type="text" placeholder="Способ передвижения" value={selectedTour.travelMethod} required />

                <label>Продолжительность</label>
                <input name="duration" type="text" placeholder="Продолжительность" value={selectedTour.duration} required />

                <label>Время отправления</label>
                <input name="departureTime" type="text" placeholder="Время отправления" value={selectedTour.departureTime} required />

                <label>Тип экскурсии</label>
                <input name="tourType" type="text" placeholder="Тип экскурсии" value={selectedTour.tourType} required />

                <label>Сложность</label>
                <input name="difficulty" type="text" placeholder="Сложность" value={selectedTour.difficulty} required />

                <label>Стоимость</label>
                <input name="cost" type="text" placeholder="Стоимость" value={selectedTour.cost} required />

                <label className={classes.addData_step}>Второй этап</label>
                <label>Загрузите фотографии для слайдера</label>
                <input
                    type="file"
                    name="photos"
                    className={classes.noBorder}
                    multiple
                    onChange={handleFileChange}
                    required
                />

                {/* Третий этап - Места */}
                <label className={classes.addData_step}>
                    Третий этап
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddPlace}>+</div>
                </label>
                {places.map((place, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Место {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`places[]`}
                                data-index={index}
                                placeholder={`Место ${index + 1}`}
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
                    Четвертый этап
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddChecklist}>+</div>
                </label>
                {checklists.map((checklist, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Чек-лист {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`checklists[]`}
                                data-index={index}
                                placeholder={`Чек-лист ${index + 1}`}
                                value={checklist}
                                onChange={(event) => handleChecklistChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveChecklist(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Пятый этап - Дни */}
                <label className={classes.addData_step}>
                    Пятый этап
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddDay}>+</div>
                </label>
                {days.map((day, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>День {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <textarea
                                name={`days[]`}
                                data-index={index}
                                placeholder={`День ${index + 1}`}
                                value={day}
                                onChange={(event) => handleDayChange(index, event)}
                                required
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveDay(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Добавить Тур</button>
            </Form>
        </div>
    );
}

export default EditMultidayTours;