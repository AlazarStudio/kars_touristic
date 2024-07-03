import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import classes from './EditRegionData.module.css';
import FormEdit from "../../FormEdit/FormEdit";
import server from '../../../../../serverConfig';

function EditRegionData({ photoMassName, title, onTourAdded }) {
    const { idToEdit } = useParams();
    const imgUrl = `${server}/refs/`;

    const [selectedPlace, setSelectedPlace] = useState({
        title: '',
        description: '',
        iconPath: [],
        coverImgPath: [],
        backgroundImgPath: [],
    });

    const [newPhotos, setNewPhotos] = useState([]);

    const fetchPlaceById = (id) => {
        fetch(`${server}/api/getOneRegion/${id}`)
            .then(response => response.json())
            .then(data => {
                setSelectedPlace({
                    ...data,
                    iconPath: Array.isArray(data.iconPath) ? data.iconPath : [],
                    coverImgPath: Array.isArray(data.coverImgPath) ? data.coverImgPath : [],
                    backgroundImgPath: Array.isArray(data.backgroundImgPath) ? data.backgroundImgPath : [],
                });
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => {
        if (title) {
            fetchPlaceById(title);
        }
    }, [title]);

    const handleFileChange = (event) => {
        const { name, files } = event.target;
        setNewPhotos(prevState => ({
            ...prevState,
            [name]: Array.from(files)
        }));
    };

    return (
        <>
            {selectedPlace && (
                <div className={classes.addData}>
                    <div className={classes.multidayTours_back}>
                        <Link to={`/admin/edit/${title}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                    </div>

                    <div className={classes.addData_title}>Изменить место</div>
                    <FormEdit
                        actionUrl={`${server}/api/updateRegion/${selectedPlace._id}`}
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
                        <label>Фотография иконки</label>
                        <div className={classes.imgBlock}>
                            {Array.isArray(selectedPlace.iconPath) && selectedPlace.iconPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>
                        {/* <label>Загрузите иконку</label>
                        <input
                            type="file"
                            name="iconPath"
                            className={classes.noBorder}
                            onChange={handleFileChange}
                        /> */}

                        <label>Фотография для фона на главной</label>
                        <div className={classes.imgBlock}>
                            {Array.isArray(selectedPlace.coverImgPath) && selectedPlace.coverImgPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>
                        {/* <label>Загрузите фотографию для фона на главной</label>
                        <input
                            type="file"
                            name="coverImgPath"
                            className={classes.noBorder}
                            onChange={handleFileChange}
                        /> */}

                        <label>Фотография для фона в регионе</label>
                        <div className={classes.imgBlock}>
                            {Array.isArray(selectedPlace.backgroundImgPath) && selectedPlace.backgroundImgPath.map((photo, index) => (
                                <div className={classes.imgBlock__item} key={index}>
                                    <img src={imgUrl + photo} alt="" />
                                </div>
                            ))}
                        </div>
                        {/* <label>Загрузите фотографию для фона в регионе</label>
                        <input
                            type="file"
                            name="backgroundImgPath"
                            className={classes.noBorder}
                            onChange={handleFileChange}
                        /> */}
                        <button type="submit">Изменить место</button>
                    </FormEdit>
                </div>
            )}
        </>
    );
}

export default EditRegionData;
