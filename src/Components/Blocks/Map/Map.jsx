import React from "react";
import classes from './Map.module.css';

function Map({ children, ...props }) {

    return (
        <>
            <iframe className={classes.map} src={props.place}></iframe>
        </>
    );
}
export default Map;