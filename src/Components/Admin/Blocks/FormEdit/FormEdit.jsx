import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import classes from './FormEdit.module.css';

function FormEdit({ onSubmit, actionUrl, method = 'post', children, fetchRegions, type, resetAll, initialValues, onTourAdded, needNavigate, setSelectedTour, hotelId, photoMassName, editAuthorTours }) {
    let regionName = useParams().title;
    let regionTypeData = useParams().type;

    editAuthorTours && (initialValues.modered = 'false');
    editAuthorTours && (initialValues.comment = '');

    const navigate = useNavigate();
    const [form, setForm] = useState(initialValues || {});
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [newPhotos, setNewPhotos] = useState([]);
    const formRef = useRef(null);

    useMemo(() => {
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
        const fieldName = name.endsWith(']') ? name.slice(0, name.indexOf('[')) : name;
        const index = name.match(/\[(\d+)\]/)?.[1];

        setForm(prev => {
            const newFormState = { ...prev };

            if (type === 'file') {
                const fileList = Array.from(files);
                if (fileList.length > 1) {
                    newFormState[fieldName] = fileList;
                    setNewPhotos(prevPhotos => [...prevPhotos, ...fileList]);
                } else {
                    newFormState[fieldName] = fileList[0];
                    setNewPhotos(prevPhotos => [...prevPhotos, fileList[0]]);
                }
            } else if (index !== undefined) {
                if (!Array.isArray(newFormState[fieldName])) {
                    newFormState[fieldName] = [];
                }
                const itemFieldName = name.slice(name.indexOf(']') + 2);
                newFormState[fieldName][index] = { ...newFormState[fieldName][index], [itemFieldName]: value };
            } else {
                newFormState[name] = value;
            }

            return newFormState;
        });
    };

    const resetForm = () => {
        setForm(initialValues || {});
        setNewPhotos([]);
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

        const appendFormData = (data, rootName = '') => {
            Object.entries(data).forEach(([key, value]) => {
                const formKey = rootName ? `${rootName}[${key}]` : key;
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            appendFormData(item, `${formKey}[${index}]`);
                        } else {
                            formData.append(`${formKey}[${index}]`, item);
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    appendFormData(value, formKey);
                } else {
                    formData.append(formKey, value);
                }
            });
        };

        appendFormData(form);

        // Добавляем новые фотографии
        newPhotos.forEach(photo => {
            formData.append(photoMassName, photo);
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
            needNavigate 
            ? 
            editAuthorTours ? navigate(`/admin/edit/${regionName}`, { replace: true }) : navigate(`/admin/edit/${regionName}/${regionTypeData}/${hotelId ? 'showRooms/' + hotelId : ''}`, { replace: true }) 
            : 
            null;
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

export default React.memo(FormEdit);
