import React, { useState, useRef } from 'react';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ onSubmit, actionUrl, method = 'post', children, fetchRegions, type }) {
    const [form, setForm] = useState({});
    const [submissionMessage, setSubmissionMessage] = useState('');
    const formRef = useRef(null);

    const [showMessage, setShowMessage] = useState(false);

    const displayMessage = (message) => {
        setSubmissionMessage(message);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    };

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const resetForm = () => {
        setForm({});
        if (formRef.current) {
            const fileInputs = formRef.current.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.value = '';
            });
        }
        displayMessage('Данные успешно добавлены');
        setTimeout(() => setShowMessage(false), 5000);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (onSubmit) {
            onSubmit(form);
            return;
        }

        let urlAdd = '';

        if (type == 'query') {
            urlAdd = '?';
        }

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (type == 'query') {
                urlAdd = urlAdd + key + '=' + form[key] + '&';
            }
            
            formData.append(key, form[key]);
        });

        try {
            const response = await axios({
                method: method,
                url: actionUrl + urlAdd,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchRegions ? fetchRegions() : null;
            resetForm();
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