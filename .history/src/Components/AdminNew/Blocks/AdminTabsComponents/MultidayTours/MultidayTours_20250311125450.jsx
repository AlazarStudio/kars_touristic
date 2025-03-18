import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './MultidayTours.module.css';
import server from '../../../../../serverConfig';
import { Link, useParams } from "react-router-dom";
import AddMultidayTours from "../AddMultidayTours/AddMultidayTours";
import EditMultidayTours from "../EditMultidayTours/EditMultidayTours";
import DuplicateTourModal from "../DuplicateTourModal/DuplicateTourModal";

const ItemTypes = {
    TOUR: 'tour',
};

function Tour({ tour, index, moveTour, deleteElement, openModal }) {
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
                <div className={classes.multidayTours_data__tour___info____title}>{tour.tourTitle}</div>
            </div>
            <div className={classes.multidayTours_data__tour___btns}>
                <div className={`${classes.multidayTours_data__tour___btns____item}`} onClick={() => openModal(tour)}>
                    <img src="/copy-svgrepo-com 1.png" alt="" />
                </div>
                <Link to={`editHotel/${tour._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>
                    <img src="/edit.webp" alt="" />
                </Link>
                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`} onClick={() => deleteElement(tour._id)}>
                    <img src="/delete.webp" alt="" />
                </div>
            </div>
        </div>
    );
}

function MultidayTours({ children, title, type, role, ...props }) {
    const { add } = useParams();
    const [selectedTour, setSelectedTour] = useState(null);
    const [tours, setTours] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const response = () => {
        if (role == 'admin') {
            fetch(`${server}/api/getMultidayTours?region=${title}&filter='-'`)
                .then(response => response.json())
                .then(data => {
                    const sortedTours = data.multidayTour.sort((a, b) => a.order - b.order);
                    setTours(sortedTours);
                })
                .catch(error => console.error('Ошибка:', error));
        }
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
        // console.log(orderedIds);

        fetch(`${server}/api/updateMultidayTourOrder`, {
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
        fetch(`${server}/api/deleteMultidayTour/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                response();
            })
            .catch(error => console.error('Ошибка при удалении тура:', error));
    };

    const openModal = (tour) => {
        setSelectedTour(tour);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTour(null);
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
                            <div className={classes.multidayTours_top__title}>Многодневные туры региона</div>
                            <Link to={'addMultiday_tour'} className={classes.multidayTours_top__add}>Добавить тур<Link>
                        </div>

                        <div className={classes.multidayTours_data}>
                            {tours.map((tour, index) => (
                                <Tour
                                    key={tour._id}
                                    index={index}
                                    tour={tour}
                                    moveTour={moveTour}
                                    deleteElement={deleteElement}
                                    openModal={openModal}
                                />
                            ))}
                        </div>
                    </div>
                </DndProvider>
                : <>
                    {add === 'addMultiday_tour' ?
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                            </div>

                            <AddMultidayTours region={title} onTourAdded={response} />
                        </>
                        :
                        <>
                            <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                                <Link to={`/admin/edit/${title}/${type}`}><img src="/back.webp" alt="" /> Вернуться назад</Link>
                            </div>

                            <EditMultidayTours region={title} onTourAdded={response} photoMassName={'photos'} />
                        </>
                    }
                </>
            }
            <DuplicateTourModal
                isOpen={isModalOpen}
                onClose={closeModal}
                tour={selectedTour}
                refreshTours={response}
            />
        </>
    );
}

export default MultidayTours;
