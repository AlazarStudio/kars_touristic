import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import classes from './EditRoom.module.css';
import FormEdit from "../../FormEdit/FormEdit";

import server from '../../../../../serverConfig';

function EditRoom({ children, activeTab, setIsDirty, region, hotelID, onRoomUpdated, onTourAdded, photoMassName, ...props }) {
    const { idToEdit, roomId } = useParams();

    let imgUrl = `${server}/refs/`;

    const [selectedRoom, setSelectedTour] = useState({
        title: '',
        description: '',
        places: '',
        square: '',
        bed: '',
        additionally: '',
        cleaning: '',
        changeOfLinen: '',
        food: '',
        type: '',
        inRoom: [],
        accessories: [],
        mainPhoto: '',
        galery: []
    });

    const [loadedPhotos, setLoadedPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);

    const { inRoom, accessories, galery } = selectedRoom;

    const fetchRoomById = (id) => {
        fetch(`${server}/api/getOneRoom/${id}`)
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
        if (roomId) {
            fetchRoomById(roomId);
        }
    }, [roomId]);

    const handleAddInRoom = useCallback(() => setSelectedTour(prevState => ({ ...prevState, inRoom: [...prevState.inRoom, ''] })), []);
    const handleAddAccessory = useCallback(() => setSelectedTour(prevState => ({ ...prevState, accessories: [...prevState.accessories, ''] })), []);
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewPhotos(files);
    };

    const handleInRoomChange = (index, event) => {
        const newInRoom = [...inRoom];
        newInRoom[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, inRoom: newInRoom }));
    };

    const handleAccessoryChange = (index, event) => {
        const newAccessories = [...accessories];
        newAccessories[index] = event.target.value;
        setSelectedTour(prevState => ({ ...prevState, accessories: newAccessories }));
    };

    const handleRemoveInRoom = index => setSelectedTour(prevState => ({ ...prevState, inRoom: prevState.inRoom.filter((_, i) => i !== index) }));
    const handleRemoveAccessory = index => setSelectedTour(prevState => ({ ...prevState, accessories: prevState.accessories.filter((_, i) => i !== index) }));

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

                updatePhotosOnServer(roomId, updatedPhotos, newPhotosToDelete);

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
            await fetch(`${server}/api/updateOneRoom/${id}`, {
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
                await fetch(`${server}/api/changeMainImgRoom?id=${id}&mainImgPath=${photoPath}`, {
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
            <div className={classes.addData_title}>Изменить Номер отеля</div>

            <FormEdit actionUrl={`${server}/api/updateOneRoom/${roomId}`} method="put" photoMassName={photoMassName} onTourAdded={onTourAdded} hotelId={idToEdit} newPhotos={newPhotos} needNavigate={true} initialValues={selectedRoom} onRoomUpdated={onRoomUpdated} setSelectedTour={setSelectedTour}>
                <label className={classes.addData_step}>Шаг 1</label>

                <input name="region" type="hidden" value={region} readOnly />
                <input name="hotelID" type="hidden" value={hotelID} readOnly />

                <label>Название </label>
                <input name="title" type="text" placeholder="Название" value={selectedRoom.title} />

                <label>Количество мест</label>
                <input name="places" type="text" placeholder="Количество мест" value={selectedRoom.places} />

                <label>Описание</label>
                <textarea name="description" type="text" placeholder="Описание" value={selectedRoom.description} ></textarea>

                <label className={classes.addData_step}>Шаг 2 - параметры номера</label>

                <label>Площадь</label>
                <input name="square" type="text" placeholder="Площадь" value={selectedRoom.square} />

                <label>Кровать</label>
                <input name="bed" type="text" placeholder="Кровать" value={selectedRoom.bed} />

                <label>Дополнительно</label>
                <input name="additionally" type="text" placeholder="Дополнительно" value={selectedRoom.additionally} />

                <label>Уборка</label>
                <input name="cleaning" type="text" placeholder="Уборка" value={selectedRoom.cleaning} />

                <label>Смена белья</label>
                <input name="changeOfLinen" type="text" placeholder="Смена белья" value={selectedRoom.changeOfLinen} />

                <label>Питание</label>
                <input name="food" type="text" placeholder="Питание" value={selectedRoom.food} />

                <label>Вид из окна</label>
                <input name="type" type="text" placeholder="Вид из окна" value={selectedRoom.type} />

                <label className={classes.addData_step}>Шаг 3</label>
                <label>Фотографии</label>

                <div className={classes.imgBlock}>
                    {loadedPhotos.map((photo, index) => (
                        <div className={classes.imgBlock__item} key={index}>
                            <img src={imgUrl + photo} alt="" />
                            <div className={classes.imgBlock_close} onClick={() => handleRemovePhoto(index, photo)}>
                                <img src="/delete.webp" alt="Delete" />
                            </div>
                            <div className={`${classes.imgBlock_checked} ${(selectedRoom.mainPhoto === photo) ? classes.imgBlock_checked_show : null}`} onClick={() => changeMainImg(roomId, photo)}>
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

                {/* Третий этап - Удобства в номере */}
                <label className={classes.addData_step}>
                    Шаг 4
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddInRoom}>+</div>
                </label>
                {inRoom.map((item, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Удобство {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`inRoom[]`}
                                data-index={index}
                                placeholder={`Удобство ${index + 1}`}
                                value={item}
                                onChange={(event) => handleInRoomChange(index, event)}
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveInRoom(index)}>-</div>
                        </div>
                    </div>
                ))}

                {/* Четвертый этап - Аксессуары */}
                <label className={classes.addData_step}>
                    Шаг 5
                    <div className={classes.addData_addButtonElements} type="button" onClick={handleAddAccessory}>+</div>
                </label>
                {accessories.map((accessory, index) => (
                    <div key={index} className={classes.addData_blockAddData}>
                        <label>Аксессуар {index + 1}</label>
                        <div className={classes.add_remove_btn}>
                            <input
                                type="text"
                                name={`accessories[]`}
                                data-index={index}
                                placeholder={`Аксессуар ${index + 1}`}
                                value={accessory}
                                onChange={(event) => handleAccessoryChange(index, event)}
                            />
                            <div className={classes.addData_addButtonElements} type="button" onClick={() => handleRemoveAccessory(index)}>-</div>
                        </div>
                    </div>
                ))}

                <button type="submit">Изменить Номер</button>
            </FormEdit>
        </div>
    );
}

export default EditRoom;
