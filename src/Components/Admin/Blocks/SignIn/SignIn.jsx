import React, { useState } from 'react';
import classes from './SignIn.module.css';
import Header_black from '../../../Blocks/Header_black/Header_black';
import CenterBlock from '../../../Standart/CenterBlock/CenterBlock';
import H2 from '../../../Standart/H2/H2';
import { jwtDecode } from "jwt-decode";



import server from '../../../../serverConfig';
import { Link, useNavigate } from 'react-router-dom';

function SignIn({ children, ...props }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Показываем прелоудер

    try {
      const response = await fetch(`${server}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const decoded = jwtDecode(data.token);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', decoded.role); // теперь корректно
        
        setTimeout(() => {
          setLoading(false);
          if (decoded.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        }, 1000);
        

        
      } else {
        setLoading(false); // Скрываем прелоудер при ошибке
        console.error('Ошибка авторизации');
      }
    } catch (error) {
      setLoading(false);
      console.error('Ошибка при запросе:', error);
    }
  };

  return (
    <>
      <Header_black />

      <CenterBlock>
        <div className={classes.registerForm}>
          <H2 text_transform={'uppercase'} text_align={'center'}>
            Войти
          </H2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Логин"
              value={formData.username}
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              required
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              Войти
            </button>
            <Link
              to={'/signUp'}
              style={{
                'text-align': 'center',
                color: '#4872F2',
                'font-weight': '600',
              }}
            >
              Зарегистрироваться как пользователь
            </Link>
            <Link
              to={'/signUpTouragent'}
              style={{
                'text-align': 'center',
                color: '#4872F2',
                'font-weight': '600',
              }}
            >
              Зарегистрироваться как автор тура
            </Link>
          </form>
          {loading && (
            <div className={classes.loaderWrapper}>
              <div className={classes.loader}></div>
            </div>
          )}{' '}
          {/* Прелоудер */}
        </div>
      </CenterBlock>
    </>
  );
}

export default SignIn;
