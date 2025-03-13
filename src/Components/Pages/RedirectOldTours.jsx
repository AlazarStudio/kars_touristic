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
    let activeTab

    switch (urlName) {
        case "tours":
            requestType = 'getOneMultidayTour'
            activeTab = 1
            break;
        case "excursions":
            requestType = 'getOneOnedayTour'
            activeTab = 2
            break;
        case "gids":
            requestType = 'getOneAuthorTours'
            activeTab = 3
            break;
        case "hotels":
            requestType = 'getOneHotel'
            activeTab = 4
            break;
        case "rooms":
            requestType = 'getOneRoom'
            activeTab = 4
            break;
        case "visits":
            requestType = 'getOnePlace'
            activeTab = 5
            break;
        case "events":
            requestType = 'getOneEvent'
            activeTab = 6
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
    localStorage.setItem("activeTab", activeTab.toString());

    if (tour) {
        navigate(`/region/${tour.region}/${id}`);
    }

    return (<></>);
}

export default RedirectOldTours;