import React, { useState } from "react";
import classes from './Tabs.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";
import H2 from "../../Standart/H2/H2";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";

function Tabs({ children, objects, ...props }) {
    const [filteredObjects, setFilteredObjects] = useState(objects);

    const updateFilteredObjects = (filteredObjects) => {
        setFilteredObjects(filteredObjects);
    };

    return (
        <>
            <div className={classes.fullBlock}>
                <CenterBlock>
                    <H2 text_transform="uppercase">{props.title}</H2>
                </CenterBlock>

                <Filter objects={objects} updateFilteredObjects={updateFilteredObjects} />

                <div className={classes.objects}>
                    {
                        filteredObjects.map((item, index) => (
                            <Object key={index} img={item.img} title={item.title} priceImg={item.priceImg} price={item.price} link={item.link} placeLink={item.placeLink} />
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default Tabs;