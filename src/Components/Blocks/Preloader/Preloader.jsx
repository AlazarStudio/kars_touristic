import React from "react";
import classes from './Preloader.module.css';

function Preloader({ children, ...props }) {
    return (
        <>
            <div className={classes.preloader}>
                <div className={classes.spinner}></div>
            </div>
        </>
    );
}

export default Preloader;