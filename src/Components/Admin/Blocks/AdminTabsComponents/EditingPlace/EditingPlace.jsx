import React from "react";
import classes from './EditingPlace.module.css';
import MultidayTours from "../MultidayTours/MultidayTours";
import AuthorTours from "../AuthorTours/AuthorTours";
import OnedayTours from "../OnedayTours/OnedayTours";
import Gids from "../Gids/Gids";
import Hotels from "../Hotels/Hotels";
import Visits from "../Visits/Visits";
import Events from "../Events/Events";
import EditRegionData from "../EditRegionData/EditRegionData";

function EditingPlace({ children, type, title, role, showTouragent, userName, userID, ...props }) {
    return (
        <>
            {type == 'multiday_tours' ? <MultidayTours role={role} title={title} type={type} /> : ''}
            {type == 'author_tours' ? <AuthorTours role={role} title={title} type={type} userName={userName} userID={userID}/> : ''}
            {type == 'oneday_tours' ? <OnedayTours role={role} title={title} type={type} /> : ''}
            {/* {type == 'gids' ? <Gids title={title} type={type}/> : ''}             */}
            {type == 'hotels' ? <Hotels title={title} type={type} /> : ''}
            {type == 'visit' ? <Visits title={title} type={type} /> : ''}
            {type == 'events' ? <Events title={title} type={type} /> : ''}
            {type == 'editRegionData' ? <EditRegionData title={title} type={type} /> : ''}
        </>
    );
}

export default EditingPlace;