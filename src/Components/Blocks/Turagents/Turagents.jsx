import React, { useEffect, useState } from "react";
import classes from './Turagents.module.css';
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import BlockTopInfo from "../BlockTopInfo/BlockTopInfo";
import H2 from "../../Standart/H2/H2";
import Form from "../Form/Form";

import turagents_bg from "/turagents_bg.webp";

import server from '../../../serverConfig';
import Preloader from "../Preloader/Preloader";

function Turagents({ children, ...props }) {
    const [turagentInfo, setTuragentInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/turagent`);
                const data = await response.json();
                setTuragentInfo(data);
            } catch (error) {
                console.error("Error fetching turagent info:", error);
            }
        }

        fetchMissionInfo();
    }, []);
    
    const [preloaderShowFirst, setPreloaderShowFirst] = useState(true);

    setTimeout(() => {
        setPreloaderShowFirst(false)
    }, 500);
    return (
        <>
            {preloaderShowFirst
                ?
                <Preloader />
                :
                <CenterBlock>
                    <WidthBlock>
                        <BlockTopInfo
                            topTitle={"Турагентам"}
                            bgImg={turagents_bg}
                        />
                        <div className={classes.turagentsText}>
                            {turagentInfo.description}
                        </div>
                        <div className={classes.turagentsButtons}>
                            <a href={`${server}/refs/${turagentInfo.docPath}`} target="_blank" className={classes.turagentsButtons_item}>Агентский договор</a>
                            {/* <a href="" className={classes.turagentsButtons_item}>Отчет Агента</a> */}
                        </div>
                    </WidthBlock>
                </CenterBlock>
            }
        </>
    );
}

export default Turagents;