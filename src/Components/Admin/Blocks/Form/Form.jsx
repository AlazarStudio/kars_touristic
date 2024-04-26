import React, { useState, useRef } from 'react';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ onSubmit, actionUrl, method = 'post', children, fetchRegions }) {
    const [form, setForm] = useState({});
    const [submissionMessage, setSubmissionMessage] = useState('');
    const formRef = useRef(null);

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
        setSubmissionMessage('Данные успешно доавлены');
        setTimeout(() => setSubmissionMessage(''), 5000); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (onSubmit) {
            onSubmit(form);
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });

        try {
            const response = await axios({
                method: method,
                url: actionUrl,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchRegions();
            resetForm();
        } catch (error) {
            console.error(error);
            setSubmissionMessage('Ошибка при добавлении. Пожалуйста попробуйте заново');
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
            {submissionMessage && <p className={classes.successMessage}>{submissionMessage}</p>}

            <form ref={formRef} className={classes.addData_form} onSubmit={handleSubmit}>
                {childrenWithProps}
            </form>
        </>
    );
}

export default Form;