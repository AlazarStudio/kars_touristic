import React, { useState } from "react";
import classes from './Add_Feedback.module.css';
import axios from 'axios';


function Add_Feedback({ userId, tourId }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [hovered, setHovered] = useState(0);

    const handleStarClick = (index) => {
        setRating(index);
    };

    const handleSubmit = async () => {
        if (!text || rating === 0) {
            alert("Пожалуйста, заполните отзыв и выберите рейтинг.");
            return;
        }

        try {
            await axios.post('/api/feedback', {
                userId,
                hotelId,
                text,
                rating,
                tourId
            });

            alert("Спасибо за ваш отзыв!");
            setText('');
            setRating(0);
        } catch (err) {
            console.log('123', userId, text, rating, tourId);
            console.error("Ошибка при отправке отзыва", err);
            alert("Произошла ошибка. Попробуйте позже.");
        }
    };

    return (
        <div className={classes.feedbackNew}>
            <div className={classes.feedbackNew_stars}>
                {[1, 2, 3, 4, 5].map((index) => (
                    <span
                        key={index}
                        onClick={() => handleStarClick(index)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(0)}
                        style={{
                            cursor: 'pointer',
                            fontSize: '32px',
                            color: index <= (hovered || rating) ? '#FFD700' : '#ccc',
                            transition: 'color 0.2s'
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>

            <textarea
                placeholder="Ваш отзыв"
                className={classes.feedbackNew_text}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button className={classes.feedbackNew_button} onClick={handleSubmit}>
                Оставить отзыв
            </button>
        </div>
    );
}

export default Add_Feedback;
