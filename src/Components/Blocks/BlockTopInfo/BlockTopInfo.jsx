import React from "react";
import classes from './BlockTopInfo.module.css';
import InfoBlock from "../../Standart/InfoBlock/InfoBlock";
import RowBlock from "../../Standart/RowBlock/RowBlock";

function BlockTopInfo({ children, ...props }) {
    return (
        <>
            <div className={classes.BlockTopInfo} style={{ backgroundImage: `url(${props.bgImg})`, marginBottom: props.mb }}>
                <div className={classes.BlockTopInfo_block}>
                    {props.topTitle ? <div className={classes.BlockTopInfo_topTitle}>{props.topTitle}</div> : null}
                    {props.title ? <div className={classes.BlockTopInfo_title}>{props.title}</div> : null}
                    {props.text ? <div className={classes.BlockTopInfo_text}>{props.text}</div> : null}
                </div>

                {props.iconImg ? <div className={classes.BlockTopInfo_block}>
                    <a href={props.link ? props.link : null} target="_blank" className={classes.BlockTopInfo_link}>
                        <img src={props.iconImg} alt="" />
                        <div className={classes.BlockTopInfo_link__text}>{props.linkText}</div>
                    </a>
                </div> : null}

                {props.infoBlockData ?
                    <RowBlock justifyContent={"space-between"}>
                        {props.infoBlockData.map((item, index) => (
                            <InfoBlock key={index} width="30%" height="110px" border="1px solid var(--white_color)" background_color="#FFFFFF1A">
                                <img src={item.icon} alt="" />
                                <div className={classes.information}>
                                    <div className={classes.information_title}>{item.title}</div>
                                    <a href={item.link} target="_blank" className={classes.information_text}>{item.text}</a>
                                </div>
                            </InfoBlock>
                        ))}

                    </RowBlock>
                    : null
                }

            </div>
        </>
    );
}

export default BlockTopInfo;