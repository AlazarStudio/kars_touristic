import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import axios from "axios";
import server from '../../../../../serverConfig';
import classes from './DuplicateTourModal.module.css';

function DuplicateTourModal({ isOpen, onClose, tour, refreshTours }) {
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [regions, setRegions] = useState([]);

    const fetchRegions = () => {
        fetch(`${server}/api/getRegions`)
            .then(response => response.json())
            .then(data => {
                const sortedRegions = data.regions.sort((a, b) => a.order - b.order);
                setRegions(sortedRegions);
            })
            .catch(error => console.error('Ошибка при загрузке регионов:', error));
    };

    useEffect(() => {
        if (isOpen && tour) {
            fetchRegions();
        }
    }, [isOpen, tour]);

    const handleRegionChange = (region) => {
        if (selectedRegions.includes(region)) {
            setSelectedRegions(selectedRegions.filter(r => r !== region));
        } else {
            setSelectedRegions([...selectedRegions, region]);
        }
    };

    const duplicateTour = async (region) => {
        const duplicatedTour = {
            ...tour,
            region: region,
            order: 0,
        };
        delete duplicatedTour._id;
        delete duplicatedTour.__v;
        delete duplicatedTour.updatedAt;
        delete duplicatedTour.createdAt;

        console.log(duplicatedTour);

        try {
            const response = await axios.post(`${server}/api/dublicateMultidayTour`, duplicatedTour, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const saveTourToRegions = async () => {
        for (const region of selectedRegions) {
            await duplicateTour(region);
        }
        
        alert('Тур успешно скопирован в выбранные регионы')
        onClose();
    };

    if (!tour) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} 
            contentLabel="Выбор регионов"
            className={classes.modalContent}
            overlayClassName={classes.modalOverlay}
        >
            <h2>Выберите регионы для дублирования тура</h2>
            <ul>
                {regions.map((region) => (
                    <li key={region.link}>
                        {tour.region != region.link && (
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedRegions.includes(region.link)}
                                    onChange={() => handleRegionChange(region.link)}
                                />
                                {region.title}
                            </label>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={saveTourToRegions}>Сохранить</button>
            <button onClick={onClose}>Закрыть</button>
        </Modal>
    );
}

export default DuplicateTourModal;
