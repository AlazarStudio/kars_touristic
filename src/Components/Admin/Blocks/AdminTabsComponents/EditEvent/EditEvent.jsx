import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import classes from './EditEvent.module.css';
import FormEdit from "../../FormEdit/FormEdit";
import server from '../../../../../serverConfig';

function EditEvent({ children, activeTab, setIsDirty, region, onTourAdded, photoMassName, ...props }) {
    const { idToEdit } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedPlace, setSelectedPlace] = useState({
        title: '',
        description: '',
        mapLink: '',
        photos: []
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const { placeItems, photos } = selectedPlace;

    const fetchPlaceById = (id) => {
        fetch(`${server}/api/getOneEvent/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setSelectedPlace(data);
                    setLoadedPhotos(data.photos || []);
                } else {
                    console.error('Received data is not an object:', data);
                }
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => {
        if (idToEdit) {
            fetchPlaceById(idToEdit);
        }
    }, [idToEdit]);

    const handleAddItem = useCallback(() => setSelectedPlace(prevState => ({ ...prevState, placeItems: [...prevState.placeItems, { title: '', description: '' }] })), []);
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewPhotos(files);
    };

    const handleItemChange = (index, field, value) => {
        setSelectedPlace(prevState => {
            const newItems = [...prevState.placeItems];
            newItems[index][field] = value;
            return { ...prevState, placeItems: newItems };
        });
    };

    const handleRemoveItem = index => setSelectedPlace(prevState => ({ ...prevState, placeItems: prevState.placeItems.filter((_, i) => i !== index) }));

    const [photosToDelete, setPhotosToDelete] = useState([]);

    const handleRemovePhoto = (index, photo) => {
        if (confirm("Вы уверены, что хотите удалить картинку?")) {
            const updatedPhotos = loadedPhotos.filter((_, i) => i !== index);
            setLoadedPhotos(updatedPhotos);

            setSelectedPlace(prevState => ({
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
            await fetch(`${server}/api/updateOneEvent/${id}`, {
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
                await fetch(`${server}/api/changeMainImgEvent?id=${id}&mainImgPath=${photoPath}`, {
                    method: 'PUT',
                });

                setSelectedPlace(prevState => ({
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
            <div className={classes.addData_title}>Изменить место</div>

            <FormEdit actionUrl={`${server}/api/updateOneEvent/${idToEdit}`} method="put" photoMassName={photoMassName} newPhotos={newPhotos} needNavigate={true} initialValues={selectedPlace}  onTourAdded={onTourAdded} setSelectedTour={setSelectedPlace}>
                <label className={classes.addData_step}>Шаг 1</label>

                <input name="region" type="hidden" placeholder="Регион" required value={region} readOnly />

                <label>Название места</label>
                <input name="title" type="text" placeholder="Название места" value={selectedPlace.title} />

                <label>Описание места</label>
                <textarea name="description" type="text" placeholder="Описание места" value={selectedPlace.description} ></textarea>

                <label>Ссылка из карт на место ивента</label>
                <input name="mapLink" type="text" placeholder="Ссылка из карт на место ивента" value={selectedPlace.mapLink} />

                <label className={classes.addData_step}>Шаг 2</label>
                <label>Фотографии</label>

                <div className={classes.imgBlock}>
                    {loadedPhotos.map((photo, index) => (
                        <div className={classes.imgBlock__item} key={index}>
                            <img src={imgUrl + photo} alt="" />
                            <div className={classes.imgBlock_close} onClick={() => handleRemovePhoto(index, photo)}>
                                <img src="/delete.png" alt="Delete" />
                            </div>
                            <div className={`${classes.imgBlock_checked} ${(selectedPlace.mainPhoto === photo) ? classes.imgBlock_checked_show : null}`} onClick={() => changeMainImg(idToEdit, photo)}>
                                <img src="/checked.png" alt="Сделать главной" />
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

                <button type="submit">Изменить место</button>
            </FormEdit>
        </div>
    );
}

export default EditEvent;
