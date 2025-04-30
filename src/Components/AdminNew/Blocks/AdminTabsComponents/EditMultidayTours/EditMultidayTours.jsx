import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

import classes from './EditMultidayTours.module.css';
import FormEdit from '../../FormEdit/FormEdit';

import server from '../../../../../serverConfig';

function EditMultidayTours({
  activeTab,
  setIsDirty,
  region,
  onTourAdded,
  photoMassName,
}) {
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
    fetch(`${server}/api/getOneMultidayTour/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setSelectedTour({
            ...data,
            departureDates: data.departureDates || [],
          });
          setLoadedPhotos(data.photos || []);
        } else {
          console.error('Received data is not an object:', data);
        }
      })
      .catch((error) => console.error('Ошибка:', error));
  };

  useEffect(() => {
    if (idToEdit) {
      fetchTourById(idToEdit);
    }
  }, [idToEdit]);

  const handleAddPlace = useCallback(() =>
    setSelectedTour(prev => ({ ...prev, places: [...prev.places, ''] })), []);

  const handleAddChecklist = useCallback(() =>
    setSelectedTour(prev => ({ ...prev, checklists: [...prev.checklists, ''] })), []);

  const handleAddEntry = useCallback(() =>
    setSelectedTour(prev => ({ ...prev, entries: [...prev.entries, ''] })), []);

  const handleAddDay = useCallback(() =>
    setSelectedTour(prev => ({ ...prev, days: [...prev.days, ''] })), []);

  const handleAddDepartureDate = () =>
    setSelectedTour(prev => ({ ...prev, departureDates: [...prev.departureDates, ''] }));

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setNewPhotos(files);
  };

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

  const handleRemovePlace = (index) =>
    setSelectedTour(prev => ({
      ...prev,
      places: prev.places.filter((_, i) => i !== index),
    }));

  const handleRemoveChecklist = (index) =>
    setSelectedTour(prev => ({
      ...prev,
      checklists: prev.checklists.filter((_, i) => i !== index),
    }));

  const handleRemoveEntry = (index) =>
    setSelectedTour(prev => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index),
    }));

  const handleRemoveDay = (index) =>
    setSelectedTour(prev => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== index),
    }));

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
      <div className={classes.addData_title}>Изменить Многодневный тур</div>

      <FormEdit
        actionUrl={`${server}/api/updateOneMultidayTour/${idToEdit}`}
        method="put"
        photoMassName={photoMassName}
        newPhotos={newPhotos}
        needNavigate={true}
        initialValues={selectedTour}
        onTourAdded={onTourAdded}
        setSelectedTour={setSelectedTour}
      >

        {/* Шаги формы */}

        {/* Места */}
        <label className={classes.addData_step}>
          Шаг 4 - Места
          <div className={classes.addData_addButtonElements} onClick={handleAddPlace}>+</div>
        </label>
        {places.map((place, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <input type="text" name="places[]" placeholder={`Место ${index + 1}`} value={place} onChange={(e) => handlePlaceChange(index, e)} />
            <div className={classes.addData_addButtonElements} onClick={() => handleRemovePlace(index)}>-</div>
          </div>
        ))}

        {/* Чек-листы */}
        <label className={classes.addData_step}>
          Шаг 5 - Чек-листы
          <div className={classes.addData_addButtonElements} onClick={handleAddChecklist}>+</div>
        </label>
        {checklists.map((checklist, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <input type="text" name="checklists[]" placeholder={`Чек-лист ${index + 1}`} value={checklist} onChange={(e) => handleChecklistChange(index, e)} />
            <div className={classes.addData_addButtonElements} onClick={() => handleRemoveChecklist(index)}>-</div>
          </div>
        ))}

        {/* Новый БЛОК — Входы (entries) */}
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

        {/* Дни */}
        <label className={classes.addData_step}>
          Шаг 6 - Дни тура
          <div className={classes.addData_addButtonElements} onClick={handleAddDay}>+</div>
        </label>
        {days.map((day, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <ReactQuill theme="snow" value={day} onChange={(value) => handleDayChange(index, value)} placeholder={`День ${index + 1}`} />
            <div className={classes.addData_addButtonElements} onClick={() => handleRemoveDay(index)}>-</div>
          </div>
        ))}

        <button type="submit">Изменить тур</button>
      </FormEdit>
    </div>
  );
}

export default EditMultidayTours;
