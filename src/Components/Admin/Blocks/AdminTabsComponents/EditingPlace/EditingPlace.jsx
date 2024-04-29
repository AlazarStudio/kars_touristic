import React from "react";
import classes from './EditingPlace.module.css';
import { Link } from "react-router-dom";

function EditingPlace({ children, type, title, ...props }) {
    return ( 
        <>
            <Link to={`/admin/edit/${title}`}>Вернуться назад</Link>
            <br />
            {type}
        </>
     );
}

export default EditingPlace;