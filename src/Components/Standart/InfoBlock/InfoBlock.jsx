import React from "react";
import classes from './InfoBlock.module.css';

function InfoBlock({ children, ...props }) {
    return (
        <>
            <div {...props} className={classes.InfoBlock} style={{
                width: props.width,
                height: props.height,
                gap: props.gap,
                margin: props.margin,
                padding: props.padding,
            }}>
                {children}
            </div>
        </>
    );
}

export default InfoBlock;