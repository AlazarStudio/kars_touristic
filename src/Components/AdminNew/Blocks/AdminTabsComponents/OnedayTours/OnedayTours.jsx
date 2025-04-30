import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import classes from './OnedayTours.module.css';
import { Link, useParams } from 'react-router-dom';
import AddOnedayTours from '../AddOnedayTours/AddOnedayTours';
import EditOnedayTours from '../EditOnedayTours/EditOnedayTours';
import server from '../../../../../serverConfig';
import DuplicateOneDayTourModal from '../DuplicateOneDayTourModal/DuplicateOneDayTourModal';
import { Eye, EyeOff } from 'lucide-react'; // уже должен быть
import { Star, StarBorder } from '@mui/icons-material';

const ItemTypes = {
  TOUR: 'tour',
};

function Tour({ tour, index, moveTour, deleteElement, openModal, setTours }) {
  const toggleVisibility = async () => {
    try {
      const res = await fetch(`${server}/api/updateOneOnedayTour/${tour._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible: !tour.visible }),
      });

      const data = await res.json();
      if (data) {
        setTours((prev) =>
          prev.map((t) =>
            t._id === tour._id ? { ...t, visible: !tour.visible } : t
          )
        );
      }
    } catch (err) {
      console.error('Ошибка при изменении видимости тура:', err);
    }
  };

  // добавляем deleteElement в параметры
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

  const togglePopular = async () => {
    try {
      const res = await fetch(`${server}/api/updateOneOnedayTour/${tour._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ popular: !tour.popular }),
      });

      const data = await res.json();
      if (data) {
        setTours((prev) =>
          prev.map((t) =>
            t._id === tour._id ? { ...t, popular: !tour.popular } : t
          )
        );
      }
    } catch (err) {
      console.error('Ошибка при изменении популярности тура:', err);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${classes.multidayTours_data__tour} ${
        isDragging ? classes.dragging : ''
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={classes.multidayTours_data__tour___img}>
        <img
          src={`${server}/refs/${
            tour.mainPhoto ? tour.mainPhoto : tour.photos[0]
          }`}
          alt=""
        />
      </div>
      <div className={classes.multidayTours_data__tour___info}>
        <div className={classes.multidayTours_data__tour___info____title}>
          {tour.tourTitle}
        </div>
      </div>
      <div className={classes.multidayTours_data__tour___btns}>
        <div className={classes.likesCount}>❤️ {tour.likesCount || 0}</div>
        <div
          onClick={togglePopular}
          title={
            tour.popular ? 'Убрать из популярных' : 'Добавить в популярные'
          }
          style={{
            width: 25,
            height: 25,
            // borderRadius: '50%',
            // backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {tour.popular ? (
            <Star style={{ color: '#FFD700' }} />
          ) : (
            <Star style={{ color: '#aaa' }} />
          )}
        </div>
        <div
          onClick={toggleVisibility}
          title={tour.visible ? 'Скрыть тур' : 'Показать тур'}
          style={{
            width: 25,
            height: 25,
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid green',
            // boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {tour.visible ? (
            <Eye size={20} color="green" />
          ) : (
            <EyeOff size={20} color="gray" />
          )}
        </div>

        <div
          className={`${classes.multidayTours_data__tour___btns____item}`}
          onClick={() => openModal(tour)}
        >
          <img src="/add.png" alt="" />
        </div>
        <Link
          to={`editHotel/${tour._id}`}
          className={`${classes.multidayTours_data__tour___btns____item} ${classes.editBtn}`}
        >
          <img src="/edit.webp" alt="" />
        </Link>
        <div
          className={`${classes.multidayTours_data__tour___btns____item} ${classes.deleteBtn}`}
          onClick={() => deleteElement(tour._id)}
        >
          <img src="/delete.webp" alt="" />
        </div>
      </div>
    </div>
  );
}

function OnedayTours({ children, title, type, role, ...props }) {
  const { add } = useParams();
  const [selectedTour, setSelectedTour] = useState(null);
  const [tours, setTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const response = () => {
    if (role == 'admin') {
      fetch(`${server}/api/getOnedayTours?region=${title}&filter='-'`)
        .then((response) => response.json())
        .then((data) => {
          const sortedTours = data.onedayTour.sort((a, b) => a.order - b.order);
          setTours(sortedTours);
        })
        .catch((error) => console.error('Ошибка:', error));
    }
  };

  useEffect(() => {
    response();
  }, [title]);

  const moveTour = (fromIndex, toIndex) => {
    const updatedTours = [...tours];
    const [movedTour] = updatedTours.splice(fromIndex, 1);
    updatedTours.splice(toIndex, 0, movedTour);
    setTours(updatedTours);

    saveOrder(updatedTours);
  };

  const saveOrder = (updatedTours) => {
    const orderedIds = updatedTours.map((tour) => tour._id);
    fetch(`${server}/api/updateOnedayTourOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderedIds }),
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error updating order:', error));
  };

  function deleteElement(id) {
    fetch(`${server}/api/deleteOnedayTour/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        response();
      })
      .catch((error) => console.error('Ошибка при удалении тура:', error));
  }

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
      {!add ? (
        <DndProvider backend={HTML5Backend}>
          <div className={classes.multidayTours}>
            <div className={classes.multidayTours_back}>
              <Link to={`/admin/edit/${title}`}>
                <img src="/back.webp" alt="" /> Вернуться назад
              </Link>
            </div>

            <div className={classes.multidayTours_top}>
              <div className={classes.multidayTours_top__title}>
                Однодневные туры региона
              </div>
              <Link
                to={'addOneday_tour'}
                className={classes.multidayTours_top__add}
              >
                Добавить однодневный тур
              </Link>
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
                  setTours={setTours}
                />
              ))}
            </div>
          </div>
        </DndProvider>
      ) : (
        <>
          {add === 'addOneday_tour' ? (
            <>
              <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                <Link to={`/admin/edit/${title}/${type}`}>
                  <img src="/back.webp" alt="" /> Вернуться назад
                </Link>
              </div>

              <AddOnedayTours region={title} onTourAdded={response} />
            </>
          ) : (
            <>
              <div className={`${classes.multidayTours_back} ${classes.mb40}`}>
                <Link to={`/admin/edit/${title}/${type}`}>
                  <img src="/back.webp" alt="" /> Вернуться назад
                </Link>
              </div>

              <EditOnedayTours
                region={title}
                onTourAdded={response}
                photoMassName={'photos'}
              />
            </>
          )}
        </>
      )}
      <DuplicateOneDayTourModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tour={selectedTour}
        refreshTours={response}
      />
    </>
  );
}

export default OnedayTours;
