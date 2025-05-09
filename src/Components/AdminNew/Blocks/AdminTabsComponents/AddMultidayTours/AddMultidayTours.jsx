import React, { useEffect, useRef, useState } from 'react';
import classes from './AddMultidayTours.module.css';
import Form from '../../Form/Form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import server from '../../../../../serverConfig';

import VanillaCalendar from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';

function AddMultidayTours({
  children,
  activeTab,
  setIsDirty,
  region,
  onTourAdded,
  ...props
}) {
  const [places, setPlaces] = useState(['']);
  const [checklists, setChecklists] = useState(['']);
  const [entries, setEntries] = useState(['']);
  const [days, setDays] = useState(['']);
  const [photos, setPhotos] = useState([]);
  const [departureDates, setDepartureDates] = useState(['']);

  const calendarRefs = useRef([]);

  const handleAddPlace = () => setPlaces([...places, '']);
  const handleAddChecklist = () => setChecklists([...checklists, '']);
  const handleAddDay = () => setDays([...days, '']);
  const handleFileChange = (event) =>
    setPhotos([...photos, ...Array.from(event.target.files)]);
  const handleAddDepartureDate = () =>
    setDepartureDates([...departureDates, '']);

  const handleAddEntry = () => setEntries([...entries, '']);
  const handleEntryChange = (index, event) => {
    const newEntries = [...entries];
    newEntries[index] = event.target.value;
    setEntries(newEntries);
  };
  const handleRemoveEntry = (index) =>
    setEntries((current) => current.filter((_, i) => i !== index));

  const resetAll = () => {
    setPlaces(['']);
    setChecklists(['']);
    setDays(['']);
    setPhotos([]);
    setDepartureDates([]);
  };

  const handleDepartureDateChange = (index, value) => {
    const newDepartureDates = [...departureDates];
    newDepartureDates[index] = value;
    setDepartureDates(newDepartureDates);
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

  const handleDayChange = (index, value) => {
    const newDays = [...days];
    newDays[index] = value;
    setDays(newDays);
  };

  function removeItemFromArray(array, index) {
    return array.filter((item, i) => i !== index);
  }

  const handleRemoveDepartureDate = (index) => {
    setDepartureDates((current) => removeItemFromArray(current, index));
    calendarRefs.current = calendarRefs.current.filter((_, i) => i !== index);
  };

  const handleRemovePlace = (index) =>
    setPlaces((current) => removeItemFromArray(current, index));
  const handleRemoveChecklist = (index) =>
    setChecklists((current) => removeItemFromArray(current, index));
  const handleRemoveDay = (index) =>
    setDays((current) => removeItemFromArray(current, index));

  const initialValues = {
    region,
    places,
    checklists,
    entries,
    days,
    photos,
    departureDates,
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
            },
          },
          input: true,
          actions: {
            changeToInput(e, self) {
              if (!self.HTMLInputElement) return;
              if (self.selectedDates.length > 0) {
                const dateRange = `${self.selectedDates[0]}${
                  self.selectedDates.length > 1
                    ? ` - ${self.selectedDates[self.selectedDates.length - 1]}`
                    : ''
                }`;
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
          },
        };

        const calendar = new VanillaCalendar(
          calendarRefs.current[index],
          options
        );
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

    const formattedStartDate = formatDate(startDate);

    if (endDate) {
      const formattedEndDate = formatDate(endDate);
      return `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      return formattedStartDate;
    }
  }

  return (
    <div className={classes.addData}>
      <div className={classes.addData_title}>ДОБАВИТЬ Многодневный тур</div>

      <Form
        actionUrl={`${server}/api/addMultidayTour`}
        method="post"
        needNavigate={true}
        resetAll={resetAll}
        initialValues={initialValues}
        onTourAdded={onTourAdded}
      >
        <label className={classes.addData_step}>
          Шаг 1 - основная информация
        </label>

        <div>
          <input
            name="region"
            type="hidden"
            placeholder="Регион"
            required
            value={region}
            readOnly
          />
        </div>

        <label>Тип бронирования</label>
        <select name="typeOfBron" required>
          <option value="" disabled>
            Выберите тип бронирования
          </option>
          <option value="Оставить заявку">Оставить заявку</option>
          <option value="Оплата на сайте">Оплата на сайте</option>
        </select>

        <label>Название тура</label>
        <input
          name="tourTitle"
          type="text"
          placeholder="Название тура"
          required
        />

        <label>Cпособ передвижения</label>
        <input
          name="travelMethod"
          type="text"
          placeholder="Способ передвижения"
          required
        />

        <label>Продолжительность</label>
        <input
          name="duration"
          type="text"
          placeholder="Продолжительность"
          required
        />

        <label>Время отправления</label>
        <input
          name="departureTime"
          type="text"
          placeholder="Время отправления"
          required
        />

        <label>Тип экскурсии</label>
        <input
          name="tourType"
          type="text"
          placeholder="Тип экскурсии"
          required
        />

        <label>Сложность</label>
        <input name="difficulty" type="text" placeholder="Сложность" required />

        <label>Минимальная цена</label>
        <input
          name="min"
          type="number"
          placeholder="Минимальная цена"
          required
        />

        <label>Максимальная цена</label>
        <input
          name="max"
          type="number"
          placeholder="Максимальная цена"
          required
        />

        <label>Стоимость</label>
        <input name="cost" type="text" placeholder="Стоимость" required />

        <label>Дополнительная информация (не обязательно)</label>
        <input
          name="optional"
          type="text"
          placeholder="Дополнительная информация"
        />

        <label className={classes.addData_step}>Шаг 2 - фотографии тура</label>
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
          Шаг 3 - Даты проведения тура
          <div
            className={classes.addData_addButtonElements}
            type="button"
            onClick={handleAddDepartureDate}
          >
            +
          </div>
        </label>
        {departureDates.map((departureDate, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <label>Дата проведения {index + 1}</label>
            <div className={classes.add_remove_btn}>
              <input
                readOnly
                ref={(el) => (calendarRefs.current[index] = el)}
                type="text"
                name={`departureDates[]`}
                data-index={index}
                placeholder={`Дата отправления  ${index + 1}`}
                value={formatDateRange(departureDate)}
                onChange={(event) => handleDepartureDateChange(index, event)}
                required
              />
              <div
                className={classes.addData_addButtonElements}
                type="button"
                onClick={() => handleRemoveDepartureDate(index)}
              >
                -
              </div>
            </div>
          </div>
        ))}

        {/* Третий этап - Места */}
        <label className={classes.addData_step}>
          Шаг 4 - Места
          <div
            className={classes.addData_addButtonElements}
            type="button"
            onClick={handleAddPlace}
          >
            +
          </div>
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
              <div
                className={classes.addData_addButtonElements}
                type="button"
                onClick={() => handleRemovePlace(index)}
              >
                -
              </div>
            </div>
          </div>
        ))}

        {/* Четвертый этап - Чек-листы */}
        <label className={classes.addData_step}>
          Шаг 5 - Чек-листы
          <div
            className={classes.addData_addButtonElements}
            type="button"
            onClick={handleAddChecklist}
          >
            +
          </div>
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
              <div
                className={classes.addData_addButtonElements}
                type="button"
                onClick={() => handleRemoveChecklist(index)}
              >
                -
              </div>
            </div>
          </div>
        ))}

        <label className={classes.addData_step}>
          Шаг 5.1 - Что входит в тур
          <div
            className={classes.addData_addButtonElements}
            type="button"
            onClick={handleAddEntry}
          >
            +
          </div>
        </label>
        {entries.map((entry, index) => (
          <div key={index} className={classes.addData_blockAddData}>
            <label>Что входит {index + 1}</label>
            <div className={classes.add_remove_btn}>
              <input
                type="text"
                name={`entries[]`}
                data-index={index}
                placeholder={`Что входит ${index + 1}`}
                value={entry}
                onChange={(event) => handleEntryChange(index, event)}
                required
              />
              <div
                className={classes.addData_addButtonElements}
                type="button"
                onClick={() => handleRemoveEntry(index)}
              >
                -
              </div>
            </div>
          </div>
        ))}

        {/* Пятый этап - Дни */}
        <label className={classes.addData_step}>
          Шаг 6 - Информация по дням
          <div
            className={classes.addData_addButtonElements}
            type="button"
            onClick={handleAddDay}
          >
            +
          </div>
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
              <div
                className={classes.addData_addButtonElements}
                type="button"
                onClick={() => handleRemoveDay(index)}
              >
                -
              </div>
            </div>
          </div>
        ))}

        <button type="submit">Добавить Тур</button>
      </Form>
    </div>
  );
}

export default AddMultidayTours;
