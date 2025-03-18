import React from "react";
import classes from './Add_Feedback.module.css';

function Add_Feedback({ children, ...props }) {
    return (
        <div div className={classes.feedbackNew} >
            <div className={classes.feedbackNew_stars}>
                <img src="/starFeedback.svg" alt="" />
                <img src="/starFeedback.svg" alt="" />
                <img src="/starFeedback.svg" alt="" />
                <img src="/starFeedback.svg" alt="" />
                <img src="/starFeedback.svg" alt="" />
            </div>

            <textarea type="text" placeholder="Ваш отзыв" className={classes.feedbackNew_text} />

            <button className={classes.feedbackNew_button}>Оставить отзыв</button>
        </div >
    );
}

export default Add_Feedback;