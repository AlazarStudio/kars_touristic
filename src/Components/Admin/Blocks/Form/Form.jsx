import React, { useState } from 'react';
import axios from 'axios';

import classes from './Form.module.css';

function Form({ onSubmit, actionUrl, method = 'post', children }) {
    const [form, setForm] = useState({});

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
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
            console.log(response);
        } catch (error) {
            console.error(error);
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
            <form className={classes.addData_form} onSubmit={handleSubmit}>
                {childrenWithProps}
                <button type="submit">Добавить регион</button>
            </form>
        </>
    );
}

export default Form;