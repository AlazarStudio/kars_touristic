import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './FormEdit.module.css';

function FormEdit({ onSubmit, actionUrl, method = 'post', children, fetchRegions, type, resetAll, initialValues, onTourAdded, needNavigate, setSelectedTour, newPhotos }) {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialValues || {});
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (initialValues) {
            setForm(initialValues);
        }
    }, [initialValues]);

    const displayMessage = (message) => {
        setSubmissionMessage(message);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000);
    };

    useEffect(() => {
        setSelectedTour(form);
    }, [form]);

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;
        setForm(prev => {
            const newFormState = { ...prev };

            if (type === 'file') {
                newFormState[name] = files.length > 1 ? [...files] : files[0];
            } else if (name.endsWith('[]')) {
                const fieldName = name.slice(0, -2);
                const index = parseInt(event.target.dataset.index, 10);
                const updatedArray = [...(prev[fieldName] || [])];
                updatedArray[index] = value;
                newFormState[fieldName] = updatedArray;
            } else {
                newFormState[name] = value;
            }

            return newFormState;
        });
    };

    const resetForm = () => {
        setForm(initialValues || {});
        if (formRef.current) {
            const fileInputs = formRef.current.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.value = '';
            });
        }
        displayMessage('Данные успешно добавлены');
        setTimeout(() => setShowMessage(false), 5000);
        resetAll && resetAll();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (onSubmit) {
            onSubmit(form);
            return;
        }
    
        let urlAdd = '';
        const formData = new FormData();
        
        // Добавляем существующие данные из формы
        Object.entries(form).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(key, item));
            } else {
                formData.append(key, value);
            }
        });
    
        // Добавляем новые фотографии
        newPhotos.forEach(photo => {
            formData.append('photos', photo);
        });
    
        if (type === 'query') {
            urlAdd = '?';
            Object.keys(form).forEach(key => {
                urlAdd += `${encodeURIComponent(key)}=${encodeURIComponent(form[key])}&`;
            });
        }
    
        try {
            const response = await axios({
                method: method,
                url: actionUrl + urlAdd,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchRegions?.();
            resetForm();
            displayMessage('Данные успешно добавлены');
            onTourAdded?.();
            needNavigate ? navigate('/admin/edit/Karachaevo-Cherkessiya/multiday_tours/', { replace: true }) : null;
        } catch (error) {
            console.error(error);
            displayMessage('Ошибка при добавлении данных');
        }
    };
    

    const childrenWithProps = React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, {
            ...child.props,
            onChange: handleChange,
            value: child.props.type !== 'file' ? form[child.props.name] || '' : undefined,
        }) : child
    );

    return (
        <>
            <p className={`${classes.successMessage} ${showMessage ? classes.showMessage : ''}`}>{submissionMessage}</p>
            <form ref={formRef} className={classes.addData_form} onSubmit={handleSubmit}>
                {childrenWithProps}
            </form>
        </>
    );
    }
    
    export default FormEdit;
