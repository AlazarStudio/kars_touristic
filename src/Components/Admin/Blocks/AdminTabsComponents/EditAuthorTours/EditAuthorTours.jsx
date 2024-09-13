import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import classes from './EditAuthorTours.module.css';
import FormEdit from "../../FormEdit/FormEdit";

import server from '../../../../../serverConfig';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';
function EditAuthorTours({ children, activeTab, setIsDirty, region, onTourAdded, photoMassName, ...props }) {
    const { idToEdit } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedTour, setSelectedTour] = useState({
        tourTitle: '',
        travelMethod: '',
        duration: '',
        departureTime: '',
        tourType: '',
        difficulty: '',
        min: '',
        max: '',
        cost: '',
        optional: '',
        places: [],
        checklists: [],
        days: [],
        departureDates: [],
        photos: [],
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const calendarRefs = useRef([]);
    const { places, checklists, days, departureDates, photos } = selectedTour;

    const fetchTourById = (id) => {
        fetch(`${server}/api/getOneAuthorTours/${id}`)
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
    const handleAddDepartureDate = () => setSelectedTour(prevState => ({ ...prevState, departureDates: [...prevState.departureDates, ''] }));
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

    const handleDayChange = (index, value) => { // Добавляем value как аргумент
        const newDays = [...days];
        newDays[index] = value; // Используем переданный value
        setSelectedTour(prevState => ({ ...prevState, days: newDays }));
    };

    const handleDepartureDateChange = (index, value) => {
        const newDepartureDates = [...departureDates];
        newDepartureDates[index] = value;
        setSelectedTour(prevState => ({ ...prevState, departureDates: newDepartureDates }));
    };

    const handleRemovePlace = index => setSelectedTour(prevState => ({ ...prevState, places: prevState.places.filter((_, i) => i !== index) }));
    const handleRemoveChecklist = index => setSelectedTour(prevState => ({ ...prevState, checklists: prevState.checklists.filter((_, i) => i !== index) }));
    const handleRemoveDay = index => setSelectedTour(prevState => ({ ...prevState, days: prevState.days.filter((_, i) => i !== index) }));
    const handleRemoveDepartureDate = index => {
        setSelectedTour(prevState => ({
            ...prevState,
            departureDates: prevState.departureDates.filter((_, i) => i !== index)
        }));
        calendarRefs.current = calendarRefs.current.filter((_, i) => i !== index);
    };

    const [photosToDelete, setPhotosToDelete] = useState([]);

    const handleRemovePhoto = (index, photo) => {
        if (confirm("Вы уверены, что хотите удалить картинку?")) {
            const updatedPhotos = loadedPhotos.filter((_, i) => i !== index);
            setLoadedPhotos(updatedPhotos);

            setSelectedTour(prevState => ({
                ...prevState,
                photos: updatedPhotos
            }));

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
            const response = await fetch(`${server}/api/updateOneAuthorTour/${id}`, {
                method: 'PUT',
                body: formData
            });
        } catch (error) {
            console.error('Error updating photos', error);
        }
    };

    const changeMainImg = async (id, photoPath) => {
        if (confirm("Вы уверены, что хотите сделать эту картинку главной?")) {
            try {
                const response = await fetch(`${server}/api/changeMainImgAuthorTour?id=${id}&mainImgPath=${photoPath}`, {
                    method: 'PUT',
                });

                setSelectedTour(prevState => ({
                    ...prevState,
                    mainPhoto: photoPath
                }));
            } catch (error) {
                console.error('Error updating photos', error);
            }
        }
    };

    useEffect(() => {
        departureDates.forEach((_, index) => {
            if (calendarRefs.current[index]) {
                const options = {
                    settings: {
                        lang: 'ru',
                        iso8601: true,
                        visibility: {
                            theme: 'light',
                            daysOutside: false,
                        },
                        range: {
                            disableGaps: true,
                            disablePast: true,
                            disabled: departureDates,
                        },
                        selection: {
                            day: 'multiple-ranged',
                        }
                    },
                    input: true,
                    actions: {
                        changeToInput(e, self) {
                            if (!self.HTMLInputElement) return;
                            if (self.selectedDates.length > 0) {
                                const dateRange = `${self.selectedDates[0]}${self.selectedDates.length > 1 ? ` - ${self.selectedDates[self.selectedDates.length - 1]}` : ''}`;
                                self.HTMLInputElement.value = dateRange;
                                handleDepartureDateChange(index, dateRange);    
                                // Закрываем календарь после выбора второй даты
                                if (self.selectedDates.length > 1) {
                                    self.hide();
                                }
                            } else {
                                self.HTMLInputElement.value = '';
                                handleDepartureDateChange(index, '');
                            }
                        },
                    }
                };

                const calendar = new VanillaCalendar(calendarRefs.current[index], options);
                calendar.init();
            }
        });
    }, [departureDates]);

    function formatDateRange(dateRange) {
        if (typeof dateRange !== 'string' || dateRange === '') return;
        
        const [startDate, endDate] = dateRange.split(' - ');

        const formatDate = (date) => {
            const [year, month, day] = date.split('-');
            return `${day}.${month}.${year}`;
        };

        const formattedStartDate = formatDate(startDate.replace(/\s/g, ''));

        if (endDate) {
            const formattedEndDate = formatDate(endDate.replace(/\s/g, ''));
            return `${formattedStartDate} - ${formattedEndDate}`;
        } else {
            return formattedStartDate;
        }
    }

    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Изменить Авторский тур</div>

            <FormEdit actionUrl={`${server}/api/updateOneAuthorTour/${idToEdit}`} editAuthorTours={true} method="put" photoMassName={photoMassName} newPhotos={newPhotos} needNavigate={true} initialValues={selectedTour} onTourAdded={onTourAdded} setSelectedTour={setSelectedTour}>
                <label className={classes.addData_step}>Шаг 1 - основная информация</label>

                <input name="region" type="hidden" placeholder="Регион" required value={region} readOnly />

                <label>Тип бронирования</label>
                <select name="typeOfBron" required value={selectedTour.typeOfBron}>
                    <option value="Оставить заявку">Оставить заявку</option>
                    <option value="Оплата на сайте">Оплата на сайте</option>
                </select>
                
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

                <label>Минимальное количество людей</label>
                <input name="min" type="number" placeholder="Минимальное количество людей" required />

                <label>Максимальное количество людей</label>
                <input name="max" type="number" placeholder="Максимальное количество людей" required />

                <label>Стоимость</label>
                <input name="cost" type="text" placeholder="Стоимость" value={selectedTour.cost} />

                <label>Дополнительная информация (не обязательно)</label>
                <input name="optional" type="text" placeholder="Дополнительная информация" value={selectedTour.optional} />

                <label className={classes.addData_step}>Шаг 2 - фотографии тура</label>
                <label>Фотографии</label>

                <div className={classes.imgBlock}>
                    {loadedPhotos.map((photo, index) => (
                        <div className={classes.imgBlock__item} key={index}>
                            <img src={imgUrl + photo} alt="" />
                            <div className={classes.imgBlock_close} onClick={() => handleRemovePhoto(index, photo)}>
                                <img src="/delete.webp" alt="Delete" />
                            </div>
                            <div className={`${classes.imgBlock_checked} ${(selectedTour.mainPhoto == photo) ? classes.imgBlock_checked_show : null}`} onClick={() => changeMainImg(idToEdit, photo)}>
                                <img src="/checked.webp" alt="Сделать главной" />
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


                {/* Третий этап - Диапазоны дат */}
                <label className={classes.addData_step}>
                    Шаг 3 - Даты проведения тура
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddDepartureDate}>+</div>
                </label>

                {departureDates.map((dateRange, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Дата проведения {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                ref={(el) => calendarRefs.current[index] = el}
                                type="text"
                                name={`departureDates[]`}
                                placeholder="Выберите диапазон дат"
                                value={formatDateRange(dateRange)}
                                readOnly
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveDepartureDate(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Третий этап - Места */}
                <label className={classes.addData_step}>
                    Шаг 4 - Места
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
                    Шаг 5 - Чек-листы
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
                    Шаг 6 - Информация по дням
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddDay}>+</div>
                </label>
                {days.map((day, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>День {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <ReactQuill
                                theme="snow"
                                value={day}
                                onChange={(value) => handleDayChange(index, value)} // Правильно обрабатываем изменение
                                placeholder={`День ${index + 1}`}
                                style={{ width: '100%', height: '400px', marginBottom: '80px' }}
                                required
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

export default EditAuthorTours;