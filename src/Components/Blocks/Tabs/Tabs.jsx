import React, { useState, useEffect } from "react";
import classes from './Tabs.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";
import H2 from "../../Standart/H2/H2";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";

import server from '../../../serverConfig'

function Tabs({ children, regionName, requestType, tableName, pageName, ...props }) {
    const [filteredObjects, setFilteredObjects] = useState([]);


    const updateFilteredObjects = (filteredObjects) => {
        setFilteredObjects(filteredObjects);
    };

    const fetchData = () => {
        fetch(`${server}/api/${requestType}`)
            .then(response => response.json())
            .then(data => setFilteredObjects(data[tableName]))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);


    const foundData = filteredObjects ? filteredObjects.filter(filteredObject => filteredObject.region === regionName) : [];

    return (
        <>
            {foundData ?
                <div className={classes.fullBlock}>
                    <CenterBlock>
                        <H2 text_transform="uppercase">{props.title}</H2>
                    </CenterBlock>

                    <Filter objects={foundData} updateFilteredObjects={updateFilteredObjects} />

                    <div className={classes.objects}>
                        {
                            foundData.map((item, index) => (
                                <Object key={index} regionData={item} pageName={pageName}/>
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