import React, { useEffect, useState } from "react";
import classes from './Favorites_Page.module.css';
import Header_black from "../../Blocks/Header_black/Header_black";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../Standart/WidthBlock/WidthBlock";
import H2 from "../../Standart/H2/H2";
import server from '../../../serverConfig';
import Object from "../../Blocks/Object/Object";

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

    const [multidayTours, setMultidayTours] = useState([]);
    const [onedayTours, setOnedayTours] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [places, setPlaces] = useState([]);
    const [author, setAuthor] = useState([]);

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
        fetchRequest('getHotels', 'hotels', setHotels);
        fetchRequest('getPlaces', 'places', setPlaces);
        fetchRequest('getAuthorTours', 'authorTour', setAuthor);
    }, []);


    let likesMass = user ? user.likes : [];

    const filteredMultidayTours = multidayTours.length > 0 ? multidayTours.filter(tour => likesMass.includes(tour._id)) : [];
    const filteredOnedayTours = onedayTours.length > 0 ? onedayTours.filter(tour => likesMass.includes(tour._id)) : [];
    const filteredHotels = hotels.length > 0 ? hotels.filter(hotel => likesMass.includes(hotel._id)) : [];
    const filteredPlaces = places.length > 0 ? places.filter(place => likesMass.includes(place._id)) : [];
    const filteredAuthor = author.length > 0 ? author.filter(author => likesMass.includes(author._id)) : [];

    return (
        <>
        
            <CenterBlock>
                <WidthBlock>
                    {filteredMultidayTours.length > 0 ?
                        <>
                            <H2 text_transform={'uppercase'} text_align={'center'}>Избранные многодневные  туры</H2>
                            <div className={classes.objects}>
                                {
                                    filteredMultidayTours.map((item, index) => (
                                        <Object key={index} regionData={item} pageName={'multidayTour'} titleObject={'tourTitle'} />
                                    ))
                                }
                            </div>
                        </>
                        : null}

                    {filteredOnedayTours.length > 0 ?
                        <>
                            <H2 text_transform={'uppercase'} text_align={'center'}>Избранные однодневные туры</H2>
                            <div className={classes.objects}>
                                {
                                    filteredOnedayTours.map((item, index) => (
                                        <Object key={index} regionData={item} pageName={'onedayTour'} titleObject={'tourTitle'} />
                                    ))
                                }
                            </div>
                        </>
                        : null}

                    {filteredHotels.length > 0 ?
                        <>
                            <H2 text_transform={'uppercase'} text_align={'center'}>Избранные отели</H2>
                            <div className={classes.objects}>
                                {
                                    filteredHotels.map((item, index) => (
                                        <Object key={index} regionData={item} pageName={'hotels'} titleObject={'title'} />
                                    ))
                                }
                            </div>
                        </>
                        : null}

                    {filteredPlaces.length > 0 ?
                        <>
                            <H2 text_transform={'uppercase'} text_align={'center'}>Избранные места для посещения</H2>
                            <div className={classes.objects}>
                                {
                                    filteredPlaces.map((item, index) => (
                                        <Object key={index} regionData={item} pageName={'places'} titleObject={'title'} />
                                    ))
                                }
                            </div>
                        </>
                        : null}

                    {filteredAuthor.length > 0 ?
                        <>
                            <H2 text_transform={'uppercase'} text_align={'center'}>Избранные места для посещения</H2>
                            <div className={classes.objects}>
                                {
                                    filteredAuthor.map((item, index) => (
                                        <Object key={index} regionData={item} pageName={'authorTour'} titleObject={'tourTitle'} />
                                    ))
                                }
                            </div>
                        </>
                        : null}

                    {filteredMultidayTours.length == 0 && filteredOnedayTours.length == 0 && filteredHotels.length == 0 && filteredPlaces.length == 0 ?
                        <div className={classes.nonFoundFavorites}>
                            <H2 text_transform={'uppercase'} text_align={'center'} margin={'0 0 40px 0'}>В избранном еще ничего нет</H2>
                        </div>
                        : <br />
                    }
                </WidthBlock>
            </CenterBlock>
        </>
    );
}

export default Favorites_Page;