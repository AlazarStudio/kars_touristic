import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import classes from './EditMultidayTours.module.css';
import FormEdit from "../../FormEdit/FormEdit";

function EditMultidayTours({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const { idToEdit } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedTour, setSelectedTour] = useState({
        tourTitle: '',
        travelMethod: '',
        duration: '',
        departureTime: '',
        tourType: '',
        difficulty: '',
        cost: '',
        places: [],
        checklists: [],
        days: [],
        photos: []
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const { places, checklists, days, photos } = selectedTour;

    const fetchTourById = (id) => {
        fetch(`${server}/api/getOneMultidayTour/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setSelectedTour(data);
                    setLoadedPhotos(data.photos || []);
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

    const handleAddPlace = useCallback(() => setSelectedTour(prevState => ({ ...prevState, places: [...prevState.places, ''] })), []);
    const handleAddChecklist = useCallback(() => setSelectedTour(prevState => ({ ...prevState, checklists: [...prevState.checklists, ''] })), []);
    const handleAddDay = useCallback(() => setSelectedTour(prevState => ({ ...prevState, days: [...prevState.days, ''] })), []);
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewPhotos(files);
    };

    const handlePlaceChange = (index, event) => {
        const newPlaces = [...places];
        newPlaces[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, places: newPlaces }));
    };

    const handleChecklistChange = (index, event) => {
        const newChecklists = [...checklists];
        newChecklists[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, checklists: newChecklists }));
    };

    const handleDayChange = (index, event) => {
        const newDays = [...days];
        newDays[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, days: newDays }));
    };

    const handleRemovePlace = index => setSelectedTour(prevState => ({ ...prevState, places: prevState.places.filter((_, i) => i !== index) }));
    const handleRemoveChecklist = index => setSelectedTour(prevState => ({ ...prevState, checklists: prevState.checklists.filter((_, i) => i !== index) }));
    const handleRemoveDay = index => setSelectedTour(prevState => ({ ...prevState, days: prevState.days.filter((_, i) => i !== index) }));

    const [photosToDelete, setPhotosToDelete] = useState([]);

    const handleRemovePhoto = (index, photo) => {

        if (confirm("Вы уверены, что хотите удалить картинку?")) {
            const updatedPhotos = loadedPhotos.filter((_, i) => i !== index);
            setLoadedPhotos(updatedPhotos);

            setPhotosToDelete(prevPhotos => {
                const newPhotosToDelete = [photo];

                updatePhotosOnServer(idToEdit, updatedPhotos, newPhotosToDelete);

                return newPhotosToDelete;
            });
        } 
    };


    const updatePhotosOnServer = async (id, photos, photosToDelete) => {
        const formData = new FormData();

        photos.forEach(photo => {
            formData.append('photos', photo);
        });

        formData.append('photosToDelete', JSON.stringify(photosToDelete));

        try {
            const response = await fetch(`${server}/api/updateOneMultidayTour/${id}`, {
                method: 'PUT',
                body: formData
            });
        } catch (error) {
            console.error('Error updating photos', error);
        }
    };


    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Изменить Многодневный тур</div>

            <FormEdit actionUrl={`${server}/api/updateOneMultidayTour/${idToEdit}`} method="put" newPhotos={newPhotos} needNavigate={true} initialValues={selectedTour} onTourAdded={onTourAdded} setSelectedTour={setSelectedTour}>
                <label className={classes.addData_step}>Шаг 1</label>

                <input name="region" type="hidden" placeholder="Регион" required value={region} readOnly />

                <label>Название тура </label>
                <input name="tourTitle" type="text" placeholder="Название тура" value={selectedTour.tourTitle} />

                <label>Cпособ передвижения</label>
                <input name="travelMethod" type="text" placeholder="Способ передвижения" value={selectedTour.travelMethod} />

                <label>Продолжительность</label>
                <input name="duration" type="text" placeholder="Продолжительность" value={selectedTour.duration} />

                <label>Время отправления</label>
                <input name="departureTime" type="text" placeholder="Время отправления" value={selectedTour.departureTime} />

                <label>Тип экскурсии</label>
                <input name="tourType" type="text" placeholder="Тип экскурсии" value={selectedTour.tourType} />

                <label>Сложность</label>
                <input name="difficulty" type="text" placeholder="Сложность" value={selectedTour.difficulty} />

                <label>Стоимость</label>
                <input name="cost" type="text" placeholder="Стоимость" value={selectedTour.cost} />

                <label className={classes.addData_step}>Шаг 2</label>
                <label>Фотографии</label>

                <div className={classes.imgBlock}>
                    {loadedPhotos.map((photo, index) => (
                        <div className={classes.imgBlock__item} key={index}>
                            <img src={imgUrl + photo} alt="" />
                            <div className={classes.imgBlock_close} onClick={() => handleRemovePhoto(index, photo)}>
                                <img src="/delete.png" alt="Delete" />
                            </div>
                        </div>
                    ))}
                </div>

                <br />
                <label>Загрузите фотографии для слайдера</label>
                <input
                    type="file"
                    name="photos"
                    className={classes.noBorder}
                    multiple
                    onChange={handleFileChange}
                />


                {/* Третий этап - Места */}
                <label className={classes.addData_step}>
                    Шаг 3
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

                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemovePlace(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Четвертый этап - Чек-листы */}
                <label className={classes.addData_step}>
                    Шаг 4
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

                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveChecklist(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Пятый этап - Дни */}
                <label className={classes.addData_step}>
                    Шаг 5
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

                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveDay(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Изменить Тур</button>
            </FormEdit>
        </div>
    );
}

export default EditMultidayTours;