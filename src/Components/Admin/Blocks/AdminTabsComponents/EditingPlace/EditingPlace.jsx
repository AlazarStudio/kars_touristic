import React from "react";
import classes from './EditingPlace.module.css';
import MultidayTours from "../MultidayTours/MultidayTours";

function EditingPlace({ children, type, title, ...props }) {
    return ( 
        <>
            {type == 'multiday_tours' ? <MultidayTours title={title} type={type}/> : ''}            
        </>
     );
}

export default EditingPlace;