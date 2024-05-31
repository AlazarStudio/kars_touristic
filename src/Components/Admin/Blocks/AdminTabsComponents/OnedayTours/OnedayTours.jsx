import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './OnedayTours.module.css';
import { Link, useParams } from "react-router-dom";
import AddOnedayTours from "../AddOnedayTours/AddOnedayTours";
import EditOnedayTours from "../EditOnedayTours/EditOnedayTours";
import server from '../../../../../serverConfig';

const ItemTypes = {
    TOUR: 'tour',
};

function Tour({ tour, index, moveTour, deleteElement }) { // добавляем deleteElement в параметры
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TOUR,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.TOUR,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveTour(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`${classes.multidayTours_data__tour} ${isDragging ? classes.dragging : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className={classes.multidayTours_data__tour___img}>
                <img src={`${server}/refs/${tour.photos[0]}`} alt="" />
            </div>
            <div className={classes.multidayTours_data__tour___info}>
                <div className={classes.multidayTours_data__tour___info____title}>{tour.tourTitle}</div>
            </div>
            <div className={classes.multidayTours_data__tour___btns}>
                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`} onClick={() => deleteElement(tour._id)}>Удалить</div>
                <Link to={`editOneday_tour/${tour._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>Редактировать</Link>
            </div>
        </div>
    );
}

function OnedayTours({ children, title, type, ...props }) {
    const { add } = useParams();
    const [selectedTour, setSelectedTour] = useState(null);
    const [tours, setTours] = useState([]);

    const response = () => {
        fetch(`${server}/api/getOnedayTours?region=${title}&filter='-'`)
            .then(response => response.json())
            .then(data => {
                const sortedTours = data.onedayTour.sort((a, b) => a.order - b.order);
                setTours(sortedTours);
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => { response() }, [title]);

    const moveTour = (fromIndex, toIndex) => {
        const updatedTours = [...tours];
        const [movedTour] = updatedTours.splice(fromIndex, 1);
        updatedTours.splice(toIndex, 0, movedTour);
        setTours(updatedTours);

        saveOrder(updatedTours);
    };

    const saveOrder = (updatedTours) => {
        const orderedIds = updatedTours.map(tour => tour._id);
        fetch(`${server}/api/updateOnedayTourOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderedIds }),
        })
            .then(response => response.json())
            .catch(error => console.error('Error updating order:', error));
    };

    function deleteElement(id) {
        fetch(`${server}/api/deleteOnedayTour/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                response();
            })
            .catch(error => console.error('Ошибка при удалении тура:', error));
    }

    return (
        <>
            {!add ?
                <DndProvider backend={HTML5Backend}>
                    <div className={classes.multidayTours}>
                        <div className={classes.multidayTours_back}>
                            <Link to={`/admin/edit/${title}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                        </div>

                        <div className={classes.multidayTours_top}>
                            <div className={classes.multidayTours_top__title}>Однодневные туры региона</div>
                            <Link to={'addOneday_tour'} className={classes.multidayTours_top__add}>Добавить однодневный тур</Link>
                        </div>

                        <div className={classes.multidayTours_data}>
                            {tours.map((tour, index) => (
                                <Tour
                                    key={tour._id}
                                    index={index}
                                    tour={tour}
                                    moveTour={moveTour}
                                    deleteElement={deleteElement} // Передаем функцию deleteElement
                                />
                            ))}
                        </div>
                    </div>
                </DndProvider>
                : <>
                    {add === 'addOneday_tour' ?
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <AddOnedayTours region={title} onTourAdded={response} />
                        </>
                        :
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                            </div>

                            <EditOnedayTours region={title} onTourAdded={response} />
                        </>
                    }
                </>
            }
        </>
    );
}

export default OnedayTours;
