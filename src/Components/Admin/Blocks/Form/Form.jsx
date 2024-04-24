import React, { useState } from 'react';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ children, ...props }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        iconPath: null,
        backgroundImgPath: null
    });

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;
        if (type === 'file') {
            setForm(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else {
            setForm(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
    
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('iconPath', form.iconPath); 
        formData.append('backgroundImgPath', form.backgroundImgPath);
    
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:5002/api/addRegion',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response); 
        } catch (error) {
            console.error(error);
        }
    };
    


    return (
        <>
            <form className={classes.addData_form} onSubmit={handleSubmit}>
                <label>Введите название региона</label>
                <input name="title" type="text" placeholder="Название" value={form.title} onChange={handleChange} />

                <label>Добавить описание</label>
                <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} />

                <label>Загрузите фоновое фото региона</label>
                <input type="file" name="iconPath" className={classes.noBorder} onChange={handleChange} />

                <label>Загрузите фото для обложки региона</label>
                <input type="file" name="backgroundImgPath" className={classes.noBorder} onChange={handleChange} />

                <button type="submit">Добавить регион</button>
            </form>
        </>
    );
}

export default Form;