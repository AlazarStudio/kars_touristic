import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ onSubmit, actionUrl, method = 'post', children, fetchRegions, type, resetAll, initialValues, onTourAdded, needNavigate, onSuccess }) {
    let regionName = useParams().title;
    let regionTypeData = useParams().type;

    const navigate = useNavigate();

    const [form, setForm] = useState(initialValues || {});

    const [submissionMessage, setSubmissionMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const formRef = useRef(null);

    const displayMessage = (message) => {
        setSubmissionMessage(message);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    };

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;

        if (type === 'file' && files.length) {
            setForm(prevState => ({
                ...prevState,
                [name]: files.length > 1 ? [...files] : files[0]
            }));
        } else {
            if (name.endsWith('[]')) {
                const fieldName = name.slice(0, -2);
                const existingArray = form[fieldName] || [];
                const index = parseInt(event.target.dataset.index, 10);
                const updatedArray = [...existingArray];
                updatedArray[index] = value;
                setForm(prevForm => ({
                    ...prevForm,
                    [fieldName]: updatedArray
                }));
            } else {
                setForm(prevForm => ({
                    ...prevForm,
                    [name]: value
                }));
            }
        }
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

        if (type === 'query') {
            urlAdd = '?';
            Object.keys(form).forEach(key => {
                urlAdd += `${encodeURIComponent(key)}=${encodeURIComponent(form[key])}&`;
            });
        }

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (Array.isArray(form[key])) {
                form[key].forEach((item) => {
                    formData.append(key, item);
                });
            } else {
                formData.append(key, form[key]);
            }
        });

        try {
            const response = await axios({
                method: method,
                url: actionUrl + urlAdd,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            fetchRegions && fetchRegions();
            onSuccess && onSuccess();
            resetForm();
            onTourAdded ? onTourAdded() : null
            
            needNavigate ? navigate(`/admin/edit/${regionName}/${regionTypeData}/`, { replace: true }) : null;
        } catch (error) {
            console.error(error);
            displayMessage('Ошибка при добавлении. Пожалуйста попробуйте заново');
        }
    };


    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const childProps = {
                ...child.props,
                onChange: handleChange,
                ...(child.props.type !== 'file' && { value: form[child.props.name] || '' }),
            };

            if (child.props.className) {
                childProps.className = `${child.props.className} ${childProps.className.includes(classes.noBorder) ? '' : classes.formInput}`.trim();
            }

            return React.cloneElement(child, childProps);
        }
        return child;
    });

    return (
        <>
            <p className={`${classes.successMessage} ${showMessage ? classes.showMessage : ''}`}>{submissionMessage}</p>

            <form ref={formRef} className={classes.addData_form} onSubmit={handleSubmit}>
                {childrenWithProps}
            </form>
        </>
    );
}

export default Form;