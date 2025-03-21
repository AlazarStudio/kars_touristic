import React from "react";
import classes from './Preloader.module.css';
import { CircularProgress } from "@mui/material";

function Preloader({ children, ...props }) {
    return (
        <>
            <div className={classes.preloader}>
                <CircularProgress size={50} />
                {/* <div className={classes.spinner}></div> */}
            </div>
        </>
    );
}

export default Preloader;