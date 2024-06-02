import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import classes from './EditRegionData.module.css';
import FormEdit from "../../FormEdit/FormEdit";
import server from '../../../../../serverConfig';

function EditRegionData({ children, activeTab, setIsDirty, region, onTourAdded, photoMassName, title, ...props }) {
    const { idToEdit } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedPlace, setSelectedPlace] = useState({
        title: '',
        description: '',
        iconPath: [],
        coverImgPath: [],
        backgroundImgPath: [],
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [photosToDelete, setPhotosToDelete] = useState([]);

    const fetchPlaceById = (id) => {
        fetch(`${server}/api/getOneRegion/${id}`)
            .then(response => response.json())
            .then(data => {
                setSelectedPlace({
                    ...data,
                    iconPath: data.iconPath || [],
                    coverImgPath: data.coverImgPath || [],
                    backgroundImgPath: data.backgroundImgPath || [],
                });
                setLoadedPhotos(data.photos || []);
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => {
        if (title) {
            fetchPlaceById(title);
        }
    }, [title]);

    const handleAddItem = useCallback(() => {
        setSelectedPlace(prevState => ({
            ...prevState,
            placeItems: [...prevState.placeItems, { title: '', description: '' }]
        }));
    }, []);

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

    const handleRemoveItem = (index) => {
        setSelectedPlace(prevState => ({
            ...prevState,
            placeItems: prevState.placeItems.filter((_, i) => i !== index)
        }));
    };

    const handleRemovePhoto = (index, photo) => {
        if (confirm("Вы уверены, что хотите удалить картинку?")) {
            const updatedPhotos = loadedPhotos.filter((_, i) => i !== index);
            setLoadedPhotos(updatedPhotos);

            setSelectedPlace(prevState => ({
                ...prevState,
                photos: updatedPhotos
            }));

            setPhotosToDelete(prevPhotos => {
                const newPhotosToDelete = [...prevPhotos, photo];
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
        <>
            Починить
            {/* {selectedPlace ? (
                <div className={classes.addData}>
                    <div className={classes.addData_title}>Изменить место</div>

                    <FormEdit 
                        actionUrl={`${server}/api/updateRegion/${title}`} 
                        method="put" 
                        photoMassName={photoMassName} 
                        newPhotos={newPhotos} 
                        needNavigate={true} 
                        initialValues={selectedPlace} 
                        onTourAdded={onTourAdded} 
                        setSelectedTour={setSelectedPlace}
                    >
                        <label className={classes.addData_step}>Шаг 1</label>

                        <label>Название места</label>
                        <input 
                            name="title" 
                            type="text" 
                            placeholder="Название места" 
                            value={selectedPlace.title} 
                            onChange={e => setSelectedPlace(prevState => ({ ...prevState, title: e.target.value }))}
                        />

                        <label>Описание места</label>
                        <textarea 
                            name="description" 
                            placeholder="Описание места" 
                            value={selectedPlace.description} 
                            onChange={e => setSelectedPlace(prevState => ({ ...prevState, description: e.target.value }))}
                        ></textarea>

                        <label className={classes.addData_step}>Шаг 2</label>
                        <label>Фотографии</label>

                        <div className={classes.imgBlock}>
                            {selectedPlace.iconPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>

                        <br />
                        <label>Загрузите фотографии для слайдера</label>
                        <input
                            type="file"
                            name="iconPath"
                            className={classes.noBorder}
                            multiple
                            onChange={handleFileChange}
                        />

                        <div className={classes.imgBlock}>
                            {selectedPlace.coverImgPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>

                        <br />
                        <label>Загрузите фотографии для слайдера</label>
                        <input
                            type="file"
                            name="coverImgPath"
                            className={classes.noBorder}
                            multiple
                            onChange={handleFileChange}
                        />

                        <div className={classes.imgBlock}>
                            {selectedPlace.backgroundImgPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>

                        <br />
                        <label>Загрузите фотографии для слайдера</label>
                        <input
                            type="file"
                            name="backgroundImgPath"
                            className={classes.noBorder}
                            multiple
                            onChange={handleFileChange}
                        />

                        <button type="submit">Изменить место</button>
                    </FormEdit>
                </div>
            ) : null} */}
        </>
    );
}

export default EditRegionData;
