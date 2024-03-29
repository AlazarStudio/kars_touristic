import React from "react";
import classes from './BlockTopInfo.module.css';

function BlockTopInfo({ children, ...props }) {
    return (
        <>
            <div className={classes.BlockTopInfo} style={{"background": `url(${props.bgImg})`}}>
                <div className={classes.BlockTopInfo_block}>
                    {props.topTitle ? <div className={classes.BlockTopInfo_topTitle}>{props.topTitle}</div> : null}
                    {props.title ? <div className={classes.BlockTopInfo_title}>{props.title}</div> : null}
                    {props.text ? <div className={classes.BlockTopInfo_text}>{props.text}</div> : null}
                </div>

                {props.iconImg ? <div className={classes.BlockTopInfo_block}>
                    <a href="#" target="_blank" className={classes.BlockTopInfo_link}>
                        <img src={props.iconImg} alt="" />
                        <div className={classes.BlockTopInfo_link__text}>{props.linkText}</div>
                    </a>
                </div> : null}
                
            </div>
        </>
    );
}

export default BlockTopInfo;