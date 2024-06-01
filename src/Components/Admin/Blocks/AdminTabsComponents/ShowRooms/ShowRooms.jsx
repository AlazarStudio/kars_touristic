import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import server from '../../../../../serverConfig';
import classes from './ShowRooms.module.css';
import { Link, useParams } from 'react-router-dom';

const ItemTypes = {
    ROOM: 'room',
};

function Room({ room, index, moveRoom, deleteElement, region }) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ROOM,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.ROOM,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveRoom(draggedItem.index, index);
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
                <img src={`${server}/refs/${room.mainPhoto}`} alt="" />
            </div>
            <div className={classes.multidayTours_data__tour___info}>
                <div className={classes.multidayTours_data__tour___info____title}>{room.title}</div>
            </div>
            <div className={classes.multidayTours_data__tour___btns}>
                <Link to={`${room._id}`} className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}>
                    <img src="/edit.png" alt="" />
                </Link>
                <div className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`} onClick={() => deleteElement(room._id)}>
                    <img src="/delete.png" alt="" />
                </div>
            </div>
        </div>
    );
}

function ShowRooms({ hotelId, region, type }) {
    const [rooms, setRooms] = useState([]);
    const { roomId } = useParams();

    useEffect(() => {
        fetch(`${server}/api/getRooms?hotelId=${hotelId}`)
            .then(response => response.json())
            .then(data => {
                const sortedTours = data.rooms.sort((a, b) => a.order - b.order);
                setRooms(sortedTours);
            })
            .catch(error => console.error('Ошибка:', error));
    }, [hotelId]);

    const response = () => {
        fetch(`${server}/api/getRooms?hotelId=${hotelId}`)
            .then(response => response.json())
            .then(data => {
                const sortedTours = data.rooms.sort((a, b) => a.order - b.order);
                setRooms(sortedTours);
            })
            .catch(error => console.error('Ошибка:', error));
    };

    const moveRoom = (fromIndex, toIndex) => {
        const updatedRooms = [...rooms];
        const [movedRoom] = updatedRooms.splice(fromIndex, 1);
        updatedRooms.splice(toIndex, 0, movedRoom);
        setRooms(updatedRooms);

        saveOrder(updatedRooms);
    };

    const saveOrder = (updatedRooms) => {
        const orderedIds = updatedRooms.map(room => room._id);
        fetch(`${server}/api/updateRoomsOrder`, {
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
        fetch(`${server}/api/deleteRoom/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                response();
            })
            .catch(error => console.error('Ошибка при удалении номера:', error));
    };

    return (
        <>
            {!roomId ?
                <DndProvider backend={HTML5Backend}>
                    <div className={`${classes.multidayTours_back}`}>
                        <Link to={`/admin/edit/${region}/${type}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>                    
                    <div className={classes.multidayTours_top__title}>Номера отеля</div>

                    <div className={classes.multidayTours_data}>
                        {rooms.map((room, index) => (
                            <Room
                                key={room._id}
                                index={index}
                                room={room}
                                moveRoom={moveRoom}
                                deleteElement={deleteElement}
                                region={region}
                            />
                        ))}
                    </div>
                </DndProvider>
                :
                <>
                    <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                        <Link to={`/admin/edit/${region}/${type}/showRooms/${hotelId}`}><img src="/back.png" alt="" /> Вернуться назад</Link>
                    </div>

                    изменить номер
                </>
            }
        </>
    );
}

export default ShowRooms;
