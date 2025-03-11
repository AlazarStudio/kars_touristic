import React, { useState, useEffect } from "react";
import classes from './Tabs.module.css';
import Object from "../Object/Object";
import Filter from "../Filter/Filter";
import FilterHotels from "../FilterHotels/FilterHotels";
import FilterPlaces from "../FilterPlaces/FilterPlaces";
import H2 from "../../Standart/H2/H2";
import CenterBlock from "../../Standart/CenterBlock/CenterBlock";

import { Modal, Box, Button, Slide } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import server from '../../../serverConfig'
import Tours_Page from "../../Pages/Tours_Page";
import zIndex from "@mui/material/styles/zIndex";

function Tabs({ children, regionName, requestType, tableName, pageName, titleObject, checkModered, setCartCount, ...props }) {
    const [objects, setObjects] = useState([]);
    const [filteredObjects, setFilteredObjects] = useState([]);

    const fetchData = () => {
        fetch(`${server}/api/${requestType}`)
            .then(response => response.json())
            .then(data => {
                let sortedTours = data[tableName].sort((a, b) => a.order - b.order);
                if (checkModered) {
                    sortedTours = sortedTours.filter(tour => tour.modered !== 'false');
                }
                setObjects(sortedTours);
                setFilteredObjects(sortedTours); // Изначально все объекты доступны
            })
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const foundData = filteredObjects ? filteredObjects.filter(filteredObject => filteredObject.region === regionName) : [];

    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');
    const getUserInfo = async (token) => {
        if (token) {
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
        }
    };

    useEffect(() => {
        if (token) {
            getUserInfo(token)
                .then(userData => setUser(userData))
                .catch(error => console.error('Error initializing user:', error));
        }
    }, [token]);

    const style = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: "100%",
        height: '92dvh',
        bgcolor: 'transparent',
        boxShadow: 24,
        outline: 'none',
        zIndex: '9999999',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        borderRadius: '30px 30px 0 0'
    };

    const [open, setOpen] = useState(false);
    const [idToModal, setIdToModal] = useState(false);

    const handleOpen = (id, isSimillar) => {
        setOpen(true)
        setIdToModal(id)

        if (isSimillar) {
            handleClose()
            setTimeout(() => {
                setOpen(true)
                setIdToModal(id)
            }, 300);
        }

    };

    const handleClose = () => setOpen(false);

    return (
        <>
            {foundData &&
                <div className={classes.fullBlock}>
                    {objects.length > 0 ?
                        <>
                            <CenterBlock >
                                <H2 text_transform="uppercase">{props.title}</H2>
                                {/* <span style={{ marginTop: '10px' }}>(Найдено: {foundData.length})</span> */}
                            </CenterBlock>

                            {(requestType == 'getMultidayTours' && objects.length > 0) && <Filter objects={objects} updateFilteredObjects={setFilteredObjects} />}
                            {(requestType == 'getOnedayTours' && objects.length > 0) && <Filter objects={objects} updateFilteredObjects={setFilteredObjects} />}
                            {(requestType == 'getAuthorTours' && objects.length > 0) && <Filter objects={objects} updateFilteredObjects={setFilteredObjects} />}
                            {(requestType == 'getHotels' && objects.length > 0) && <FilterHotels objects={objects} updateFilteredObjects={setFilteredObjects} />}
                            {(requestType == 'getPlaces' && objects.length > 0) && <FilterPlaces objects={objects} updateFilteredObjects={setFilteredObjects} />}
                            {(requestType == 'getEvents' && objects.length > 0) && <FilterPlaces objects={objects} updateFilteredObjects={setFilteredObjects} />}


                            <div className={classes.objects}>
                                {
                                    foundData.map((item, index) => (
                                        <Object key={index} handleOpen={handleOpen} isSimillar={false} open={open} setCartCount={setCartCount} regionData={item} pageName={pageName} titleObject={titleObject} inCart={(user && user.cart.includes(item._id) ? 'В корзине' : 'Добавить в корзину')} />
                                    ))
                                }
                            </div>
                        </>
                        :
                        <H2 text_transform="uppercase">Ничего не найдено</H2>
                    }
                </div >
            }
            {
                open &&
                <IconButton onClick={handleClose} aria-label="close" sx={{
                    border: '1px solid white',
                    borderRadius: '50%',
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 99999999999999,
                    backgroundColor: '#fff',
                    '&:hover': {
                        backgroundColor: '#fff',
                        border: '1px solid white',
                    },
                }}>
                    <CloseIcon sx={{ color: '#000' }} />
                </IconButton>
            }

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                    <Box sx={style}>
                        <Tours_Page tableName={'multidayTour'} requestType={'getOneMultidayTour'} similar={'getMultidayTours'} pageName={'tours'} idToModal={idToModal} handleOpen={handleOpen} open={open} />
                    </Box>
                </Slide>
            </Modal>
        </>
    );
}

export default Tabs;