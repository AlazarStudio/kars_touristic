import React from "react";
import classes from './TeamBlock.module.css';

function TeamBlock({ children, ...props }) {
    return ( 
        <>
            <div className={classes.team} style={{
                width: props.width
            }}>
                <div className={classes.team_img}>
                    <img src={props.img} alt="" />
                </div>
                <div className={classes.team_title}>{props.title}</div>
                <div className={classes.team_text}>{props.text}</div>
            </div>
        </>
     );
}

export default TeamBlock;