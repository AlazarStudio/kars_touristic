import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './Visits.module.css';
import server from '../../../../../serverConfig';
import { Link, useParams } from "react-router-dom";
import AddVisits from "../AddVisits/AddVisits";
import EditVisit from "../EditVisit/EditVisit";

const ItemTypes = {
    TOUR: 'tour',
};

function Tour({ tour, index, moveTour, deleteElement }) {
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
                <img src={`${server}/refs/${tour.mainPhoto ? tour.mainPhoto : tour.photos[0]}`} alt="" />
            </div>
            <div className={classes.multidayTours_data__tour___info}>
                <div className={classes.multidayTours_data__tour___info____title}>{tour.title}</div>
            </div>
            <div className={classes.multidayTours_data__tour___btns}>
                <Link to={`editPlace/${tour._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>
                    <img src="/edit.webp" alt="" />
                </Link>
                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`} onClick={() => deleteElement(tour._id)}>
                    <img src="/delete.webp" alt="" />
                </div>
            </div>
        </div>
    );
}

function Visits({ children, title, type, ...props }) {
    const { add } = useParams();
    const [selectedTour, setSelectedTour] = useState(null);
    const [tours, setTours] = useState([]);

    const response = () => {
        fetch(`${server}/api/getPlaces?region=${title}&filter='-'`)
            .then(response => response.json())
            .then(data => {
                const sortedTours = data.places.sort((a, b) => a.order - b.order);
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
        console.log(orderedIds);
        
        fetch(`${server}/api/updatePlacesOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderedIds }),
        })
            .then(response => response.json())
            .catch(error => console.error('Error updating order:', error));
    };

    const deleteElement = (id) => {
        fetch(`${server}/api/deletePlace/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                response();
            })
            .catch(error => console.error('Ошибка при удалении тура:', error));
    };

    return (
        <>
            {!add ?
                <DndProvider backend={HTML5Backend}>
                    <div className={classes.multidayTours}>
                        <div className={classes.multidayTours_back}>
                            <Link to={`/admin/edit/${title}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                        </div>

                        <div className={classes.multidayTours_top}>
                            <div className={classes.multidayTours_top__title}>Места для посещения региона</div>
                            <Link to={'addVisit'} className={classes.multidayTours_top__add}>Добавить место</Link>
                        </div>

                        <div className={classes.multidayTours_data}>
                            {tours.map((tour, index) => (
                                <Tour
                                    key={tour._id}
                                    index={index}
                                    tour={tour}
                                    moveTour={moveTour}
                                    deleteElement={deleteElement}
                                />
                            ))}
                        </div>
                    </div>
                </DndProvider>
                : <>
                    {add === 'addVisit' ?
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                            </div>

                            <AddVisits region={title} onTourAdded={response} />
                        </>
                        :
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                            </div>

                            <EditVisit region={title} onTourAdded={response} photoMassName={'photos'}/>
                        </>
                    }
                </>
            }
        </>
    );
}

export default Visits;
