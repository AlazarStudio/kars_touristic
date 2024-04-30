import React from "react";
import classes from './EditingPlace.module.css';
import MultidayTours from "../MultidayTours/MultidayTours";
import OnedayTours from "../OnedayTours/OnedayTours";

function EditingPlace({ children, type, title, ...props }) {
    return ( 
        <>
            {type == 'multiday_tours' ? <MultidayTours title={title} type={type}/> : ''}            
            {type == 'oneday_tours' ? <OnedayTours title={title} type={type}/> : ''}            
            {type == 'hotels' ? <OnedayTours title={title} type={type}/> : ''}            
            {type == 'visit' ? <OnedayTours title={title} type={type}/> : ''}            
            {type == 'events' ? <OnedayTours title={title} type={type}/> : ''}            
        </>
     );
}

export default EditingPlace;