import React, { useState, useEffect } from "react";
import classes from './Tabs.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";
import H2 from "../../Standart/H2/H2";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";

import server from '../../../serverConfig'

function Tabs({ children, regionName, requestType, tableName, pageName, titleObject, checkModered, ...props }) {
    const [objects, setObjects] = useState([]);
    const [filteredObjects, setFilteredObjects] = useState([]);

    const fetchData = () => {
        fetch(`${server}/api/${requestType}`)
            .then(response => response.json())
            .then(data => {
                let sortedTours = data[tableName].sort((a, b) => a.order - b.order);
                if (checkModered) {
                    sortedTours = sortedTours.filter(tour => tour.modered !== 'false');
                }
                setObjects(sortedTours);
                setFilteredObjects(sortedTours); // Изначально все объекты доступны
            })
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const foundData = filteredObjects ? filteredObjects.filter(filteredObject => filteredObject.region === regionName) : [];

    console.log(foundData);

    return (
        <>
            {foundData ?
                <div className={classes.fullBlock}>
                    <CenterBlock>
                        <H2 text_transform="uppercase">{props.title}</H2>
                    </CenterBlock>

                    <Filter objects={objects} updateFilteredObjects={setFilteredObjects} />

                    <div className={classes.objects}>
                        {
                            foundData.map((item, index) => (
                                <Object key={index} regionData={item} pageName={pageName} titleObject={titleObject} />
                            ))
                        }
                    </div>
                </div>
                : null
            }
        </>
    );
}

export default Tabs;