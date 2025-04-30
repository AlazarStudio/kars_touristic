import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import classes from './EditAuthorTours.module.css';
import FormEdit from "../../FormEdit/FormEdit";

import server from '../../../../../serverConfig';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';
function EditAuthorTours({ activeTab, setIsDirty, region, onTourAdded, photoMassName }) {
    const { idToEdit } = useParams();
  
    const imgUrl = `${server}/refs/`;
  
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
      entries: [],
      days: [],
      departureDates: [],
      photos: [],
    });
  
    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [photosToDelete, setPhotosToDelete] = useState([]);
  
    const calendarRefs = useRef([]);
    const { places, checklists, entries, days, departureDates } = selectedTour;
  
    const fetchTourById = (id) => {
      fetch(`${server}/api/getOneAuthorTours/${id}`)
        .then(response => response.json())
        .then(data => {
          if (data && typeof data === 'object') {
            setSelectedTour({
              ...data,
              entries: data.entries || [],
            });
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
  
    const handleAddPlace = useCallback(() => setSelectedTour(prev => ({ ...prev, places: [...prev.places, ''] })), []);
    const handleAddChecklist = useCallback(() => setSelectedTour(prev => ({ ...prev, checklists: [...prev.checklists, ''] })), []);
    const handleAddEntry = useCallback(() => setSelectedTour(prev => ({ ...prev, entries: [...prev.entries, ''] })), []);
    const handleAddDay = useCallback(() => setSelectedTour(prev => ({ ...prev, days: [...prev.days, ''] })), []);
    const handleAddDepartureDate = () => setSelectedTour(prev => ({ ...prev, departureDates: [...prev.departureDates, ''] }));
  
    const handlePlaceChange = (index, event) => {
      const newPlaces = [...places];
      newPlaces[index] = event.target.value;
      setSelectedTour(prev => ({ ...prev, places: newPlaces }));
    };
  
    const handleChecklistChange = (index, event) => {
      const newChecklists = [...checklists];
      newChecklists[index] = event.target.value;
      setSelectedTour(prev => ({ ...prev, checklists: newChecklists }));
    };
  
    const handleEntryChange = (index, event) => {
      const newEntries = [...entries];
      newEntries[index] = event.target.value;
      setSelectedTour(prev => ({ ...prev, entries: newEntries }));
    };
  
    const handleDayChange = (index, value) => {
      const newDays = [...days];
      newDays[index] = value;
      setSelectedTour(prev => ({ ...prev, days: newDays }));
    };
  
    const handleDepartureDateChange = (index, value) => {
      const newDepartureDates = [...departureDates];
      newDepartureDates[index] = value;
      setSelectedTour(prev => ({ ...prev, departureDates: newDepartureDates }));
    };
  
    const handleRemovePlace = (index) => setSelectedTour(prev => ({ ...prev, places: prev.places.filter((_, i) => i !== index) }));
    const handleRemoveChecklist = (index) => setSelectedTour(prev => ({ ...prev, checklists: prev.checklists.filter((_, i) => i !== index) }));
    const handleRemoveEntry = (index) => setSelectedTour(prev => ({ ...prev, entries: prev.entries.filter((_, i) => i !== index) }));
    const handleRemoveDay = (index) => setSelectedTour(prev => ({ ...prev, days: prev.days.filter((_, i) => i !== index) }));
    const handleRemoveDepartureDate = (index) => {
      setSelectedTour(prev => ({
        ...prev,
        departureDates: prev.departureDates.filter((_, i) => i !== index),
      }));
      calendarRefs.current = calendarRefs.current.filter((_, i) => i !== index);
    };
  
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
                    <option value="" disabled>Выберите тип бронирования</option>
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

                <label>Минимальная цена</label>
                <input name="min" type="number" placeholder="Минимальная цена" required />

                <label>Максимальная цена</label>
                <input name="max" type="number" placeholder="Максимальная цена" required />

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

                    {/* Входы (entries) */}
        <label className={classes.addData_step}>
          Шаг 5.1 - Что входит в тур
          <div className={classes.addData_addButtonElements} onClick={handleAddEntry}>+</div>
        </label>
        {entries.map((entry, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <input type="text" name="entries[]" placeholder={`Входит ${index + 1}`} value={entry} onChange={(e) => handleEntryChange(index, e)} />
            <div className={classes.addData_addButtonElements} onClick={() => handleRemoveEntry(index)}>-</div>
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