import React from "react";
import classes from './Region.module.css';
import { Link } from "react-router-dom";

function Region({ children, ...props }) {
    return (
        <>
            <Link to={""} className={classes.main_blocks__elem}>
                <div className={classes.main_blocks__elem___img}>
                    <img src={props.bg} alt="" />
                </div>
                <div className={classes.main_blocks__elem___text}>
                    <img src={props.logo} alt="" />
                    {props.title}
                </div>
            </Link>
        </>
    );
}

export default Region;