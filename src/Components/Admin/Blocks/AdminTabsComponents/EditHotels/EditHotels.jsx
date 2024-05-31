import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import classes from './EditHotels.module.css';
import FormEdit from "../../FormEdit/FormEdit";

import server from '../../../../../serverConfig';

function EditHotels({ children, activeTab, setIsDirty, region, onTourAdded, ...props }) {
    const { idToEdit } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedTour, setSelectedTour] = useState({
        title: '',
        description: '',
        moreInfo: '',

        galery: [],
        items: [],
        links: []
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const { galery, items, links } = selectedTour;

    const fetchTourById = (id) => {
        fetch(`${server}/api/getOneHotel/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setSelectedTour(data);
                    setLoadedPhotos(data.galery || []);
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

    const handleAddPlace = useCallback(() => setSelectedTour(prevState => ({ ...prevState, items: [...prevState.items, ''] })), []);
    const handleAddChecklist = useCallback(() => setSelectedTour(prevState => ({ ...prevState, links: [...prevState.links, ''] })), []);
    const handleAddDay = useCallback(() => setSelectedTour(prevState => ({ ...prevState, days: [...prevState.days, ''] })), []);
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewPhotos(files);
    };

    const handlePlaceChange = (index, event) => {
        const newPlaces = [...items];
        newPlaces[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, items: newPlaces }));
    };

    const handleChecklistChange = (index, event) => {
        const newChecklists = [...links];
        newChecklists[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, links: newChecklists }));
    };

    const handleDayChange = (index, event) => {
        const newDays = [...days];
        newDays[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, days: newDays }));
    };

    const handleRemovePlace = index => setSelectedTour(prevState => ({ ...prevState, items: prevState.items.filter((_, i) => i !== index) }));
    const handleRemoveChecklist = index => setSelectedTour(prevState => ({ ...prevState, links: prevState.links.filter((_, i) => i !== index) }));
    const handleRemoveDay = index => setSelectedTour(prevState => ({ ...prevState, days: prevState.days.filter((_, i) => i !== index) }));

    const [photosToDelete, setPhotosToDelete] = useState([]);

    const handleRemovePhoto = (index, photo) => {
        if (confirm("Вы уверены, что хотите удалить картинку?")) {
            const updatedPhotos = loadedPhotos.filter((_, i) => i !== index);
            setLoadedPhotos(updatedPhotos);

            setSelectedTour(prevState => ({
                ...prevState,
                galery: updatedPhotos
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

        galery.forEach(photo => {
            formData.append('galery', photo);
        });

        formData.append('photosToDelete', JSON.stringify(photosToDelete));

        try {
            const response = await fetch(`${server}/api/updateOneHotel/${id}`, {
                method: 'PUT',
                body: formData
            });
        } catch (error) {
            console.error('Error updating galery', error);
        }
    };

    const changeMainImg = async (id, photoPath) => {
        if (confirm("Вы уверены, что хотите сделать эту картинку главной?")) {
            try {
                const response = await fetch(`${server}/api/changeMainImgHotel?id=${id}&mainImgPath=${photoPath}`, {
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


    return (
        <div className={classes.addData}>
            <div className={classes.addData_title}>Изменить Многодневный тур</div>

            <FormEdit actionUrl={`${server}/api/updateOneHotel/${idToEdit}`} method="put" newPhotos={newPhotos} needNavigate={true} initialValues={selectedTour} onTourAdded={onTourAdded} setSelectedTour={setSelectedTour}>
                <label className={classes.addData_step}>Шаг 1</label>

                <input name="region" type="hidden" placeholder="Регион" required value={region} readOnly />

                <label>Название отеля </label>
                <input name="title" type="text" placeholder="Название отеля" value={selectedTour.title} />

                <label>Количество звезд у отеля</label>
                <input name="stars" type="number" placeholder="Количество звезд у отеля" value={selectedTour.stars} />

                <label>Описание отеля</label>
                <textarea name="description" type="text" placeholder="Описание отеля" value={selectedTour.description} ></textarea>

                <label>Дополнительная информация</label>
                <textarea name="moreInfo" type="text" placeholder="Дополнительная информация" value={selectedTour.moreInfo} ></textarea>

                <label className={classes.addData_step}>Шаг 2</label>
                <label>Фотографии</label>

                <div className={classes.imgBlock}>
                    {loadedPhotos.map((photo, index) => (
                        <div className={classes.imgBlock__item} key={index}>
                            <img src={imgUrl + photo} alt="" />
                            <div className={classes.imgBlock_close} onClick={() => handleRemovePhoto(index, photo)}>
                                <img src="/delete.png" alt="Delete" />
                            </div>
                            <div className={`${classes.imgBlock_checked} ${(selectedTour.mainPhoto == photo) ? classes.imgBlock_checked_show : null}`} onClick={() => changeMainImg(idToEdit, photo)}>
                                <img src="/checked.png" alt="Сделать главной" />
                            </div>
                        </div>
                    ))}
                </div>

                <br />
                <label>Загрузите фотографии для слайдера</label>
                <input
                    type="file"
                    name="galery"
                    className={classes.noBorder}
                    multiple
                    onChange={handleFileChange}
                />


                {/* Третий этап - Места */}
                <label className={classes.addData_step}>
                    Шаг 3 (Удобства)
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddPlace}>+</div>
                </label>
                {items.map((place, index) => (
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
                {links.map((checklist, index) => (
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

                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveChecklist(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Изменить Отель</button>
            </FormEdit>
        </div>
    );
}

export default EditHotels;