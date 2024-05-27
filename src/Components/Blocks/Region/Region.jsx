import React from "react";
import classes from './Region.module.css';
import { Link } from "react-router-dom";

import server from '../../../serverConfig';

function Region({ children, ...props }) {
    return (
        <>
            <Link to={"/region/" + props.link} className={classes.main_blocks__elem}>
                <div className={classes.main_blocks__elem___img}>
                    <img src={server + '/refs/' + props.bg} alt="" />
                </div>
                <div className={classes.main_blocks__elem___text}>
                    <img src={server + '/refs/' + props.logo} alt="" />
                    {props.title}
                </div>
            </Link>
        </>
    );
}

export default Region;