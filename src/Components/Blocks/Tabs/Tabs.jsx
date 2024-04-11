import React, { useState } from "react";
import classes from './Tabs.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";

function Tabs({ children, objects, ...props }) {
    const [filteredObjects, setFilteredObjects] = useState(objects);

    const updateFilteredObjects = (filteredObjects) => {
        setFilteredObjects(filteredObjects);
    };

    return (
        <>
            <div className={classes.fullBlock}>
                <Filter objects={objects} updateFilteredObjects={updateFilteredObjects}/>

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