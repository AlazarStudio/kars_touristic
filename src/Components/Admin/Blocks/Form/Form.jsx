import React, { useState } from 'react';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ children, ...props }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: null,
        backgroundImg: null
    });

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;
        if (type === 'file') {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        console.log(data);

        // try {
        //     const response = await axios.post('https://your-backend-url.com/regions', data, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     });
        //     console.log('Region added:', response.data);
        // } catch (error) {
        //     console.error('Failed to upload region:', error);
        // }
    };

    return (
        <>
            <form className={classes.addData_form} onSubmit={handleSubmit}>
                <label>Введите название региона</label>
                <input name="title" type="text" placeholder="Название" value={formData.title} onChange={handleChange} />

                <label>Добавить описание</label>
                <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />

                <label>Загрузите фоновое фото региона</label>
                <input type="file" name="icon" className={classes.noBorder} onChange={handleChange} />

                <label>Загрузите фото для обложки региона</label>
                <input type="file" name="backgroundImg" className={classes.noBorder} onChange={handleChange} />

                <button type="submit">Добавить регион</button>
            </form>
        </>
    );
}

export default Form;