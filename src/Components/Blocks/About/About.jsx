import React, { useEffect, useState } from "react";
import classes from './About.module.css';

import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import RowBlock from "../../Standart/RowBlock/RowBlock";
import InfoBlock from "../../Standart/InfoBlock/InfoBlock";
import H2 from "../../Standart/H2/H2";
import TeamBlock from "../TeamBlock/TeamBlock";

import logo from "/about_title_logo.png";
import about_certificate from "/about_certificate.png";
import about_interaction from "/about_interaction.png";
import about_handshake from "/about_handshake.png";

import team_no_img from "/team_no_img.png";
import mission_arnament from "/mission_arnament.png";

import server from '../../../serverConfig';

function About({ children, ...props }) {
    let teamData = [
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
        {
            img: team_no_img,
            title: "Lorem Ipsum",
            text: "Lorem Ipsum"
        },
    ]

    const [companyInfo, setCompanyInfo] = useState("");

    useEffect(() => {
        async function fetchCompanyInfo() {
            try {
                const response = await fetch(`${server}/api/aboutCompany`);
                const data = await response.json();
                setCompanyInfo(data.aboutCompany);
            } catch (error) {
                console.error("Error fetching company info:", error);
            }
        }

        fetchCompanyInfo();
    }, []);

    const [missionInfo, setMissionInfo] = useState("");

    useEffect(() => {
        async function fetchMissionInfo() {
            try {
                const response = await fetch(`${server}/api/mission`);
                const data = await response.json();
                setMissionInfo(data.mission);
            } catch (error) {
                console.error("Error fetching mission info:", error);
            }
        }

        fetchMissionInfo();
    }, []);

    return (
        <>
            <CenterBlock>
                <WidthBlock>
                    <div className={classes.about_title}>
                        <div className={classes.about_title__left}>
                            <img src={logo} alt="" />
                        </div>
                        <div className={classes.about_title__right}>
                            <div className={classes.about_title__right___name}>О компании</div>
                            <div className={classes.about_title__right___text}>
                                {companyInfo ? companyInfo : null}
                            </div>
                        </div>
                    </div>

                    <RowBlock justifyContent={"space-between"}>
                        <InfoBlock width={"32%"} height={"150px"}>
                            <img src={about_certificate} alt="" />
                            Сертифицированный туроператор
                        </InfoBlock>
                        <InfoBlock width={"32%"} height={"150px"}>
                            <img src={about_interaction} alt="" />
                            <div className={classes.info_block_text}>
                                Работаем без посредников
                            </div>
                        </InfoBlock>
                        <InfoBlock width={"32%"} height={"150px"}>
                            <img src={about_handshake} alt="" />
                            Оказываем поддержку клиентам
                        </InfoBlock>
                    </RowBlock>

                    <CenterBlock>
                        <H2 text_transform={"uppercase"}>Наша команда</H2>
                    </CenterBlock>

                    <RowBlock justifyContent={"space-between"}>
                        {
                            teamData.map((item, index) => (
                                <TeamBlock
                                    key={index}
                                    width={"23%"}
                                    img={item.img}
                                    title={item.title}
                                    text={item.text}
                                />
                            ))
                        }
                    </RowBlock>

                    <div className={classes.mission}>
                        <div className={classes.mission_title}>
                            НАША МИССИЯ
                        </div>
                        <div className={classes.mission_line}>
                            <img src={mission_arnament} alt="" />
                            <img src={mission_arnament} alt="" />
                            <img src={mission_arnament} alt="" />
                        </div>
                        <div className={classes.mission_text}>
                            {missionInfo ? missionInfo : null}
                        </div>
                    </div>

                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default About;