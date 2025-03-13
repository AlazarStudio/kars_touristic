import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import server from '../../serverConfig'

function RedirectOldTours({ children, ...props }) {
    let { id } = useParams();

    const getSectionFromUrl = () => {
        const location = useLocation();
        const parts = location.pathname.split("/"); // Разбиваем URL по "/"
        return parts[1]; // Получаем "tours" (второй элемент, индекс 1)
    };

    let urlName = getSectionFromUrl();

    let requestType

    switch (urlName) {
        case "tours":
            requestType = 'getOneMultidayTour'
            break;
        case "excursions":
            requestType = 'getOneOnedayTour'
            break;
        case "gids":
            requestType = 'getOneAuthorTours'
            break;
        case "hotels":
            requestType = 'getOneHotel'
            break;
        case "rooms":
            requestType = 'getOneRoom'
            break;
        case "visits":
            requestType = 'getOnePlace'
            break;
        case "events":
            requestType = 'getOneEvent'
            break;
        default:
            requestType = "Страница не найдена";
            break;
    }

    const [tour, setTour] = useState();
    const fetchTour = () => {
        fetch(`${server}/api/${requestType}/${id}`)
            .then(response => response.json())
            .then(data => setTour(data))
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchTour();
    }, [id]);

    const navigate = useNavigate();

    if (tour) {
        navigate(`/region/${tour.region}/${id}`);
    }

    return (<></>);
}

export default RedirectOldTours;