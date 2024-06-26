import React, { useEffect, useState } from "react";
import classes from './Favorites_Page.module.css';
import Header_black from "../../Blocks/Header_black/Header_black";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";
import server from '../../../serverConfig';

function Favorites_Page({ children, ...props }) {
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');

    const getUserInfo = async (token) => {
        try {
            const response = await fetch(`${server}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    };

    useEffect(() => {
        getUserInfo(token)
            .then(userData => setUser(userData))
            .catch(error => console.error('Error initializing user:', error));
    }, [token]);


    let likesMass = [];

    const [multidayTours, setMultidayTours] = useState([]);
    const [onedayTours, setOnedayTours] = useState([]);

    function fetchRequest(endPoint, type, setFunction) {
        fetch(`${server}/api/${endPoint}`)
            .then(response => response.json())
            .then(data => {
                setFunction(data[type])
            })
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    }

    useEffect(() => {
        fetchRequest('getMultidayTours', 'multidayTour', setMultidayTours);
        fetchRequest('getOnedayTours', 'onedayTour', setOnedayTours);
        fetchRequest('getOnedayTours', 'onedayTour', setOnedayTours);
    }, []);


    likesMass = user ? user.likes : null;

    if (user) {
        const filteredMultidayTours = multidayTours.filter(tour => likesMass.includes(tour._id));
        const filteredOnedayTours = onedayTours.filter(tour => likesMass.includes(tour._id));
    }

    return (
        <>
            <Header_black />
            <CenterBlock>
                <WidthBlock>
                    <H2 text_transform={'uppercase'} text_align={'center'}>Избранное</H2>

                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Favorites_Page;