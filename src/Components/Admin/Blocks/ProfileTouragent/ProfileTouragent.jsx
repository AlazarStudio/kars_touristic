import React, { useState, useEffect } from "react";
import classes from './ProfileTouragent.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";

import server from '../../../../serverConfig';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ProfileTouragent({ children, ...props }) {
    let { id } = useParams();

    const [user, setUser] = useState();

    let token = localStorage.getItem('token');

    const navigate = useNavigate();

    const getUserInfo = async (token) => {
        const response = await fetch(`${server}/api/getOneTouragent/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData)
        } else {
            localStorage.removeItem('token');
            console.error('Ошибка получения информации о пользователе');
        }
    };

    useEffect(() => {
        if (token) {
            getUserInfo(token);
        } else {
            navigate('/signIn');
        }
    }, [token])


    const updateTouragent = async (token) => {
        const response = await fetch(`${server}/api/userUpdateAccess/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            alert('Автор туров подтвержден');
        } else {
            console.error('Ошибка получения информации о пользователе');
        }
    };

    const [form, setForm] = useState({
        touragent: 'alimdzhatdoev@mail.ru',
        text: 'Ваша учетная запись не соответсвует необходимым требованиям и была удалена. Пройдите повторную регистрацию исправив описанные проблемы.',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const deleteElement = async (e) => {
        if (confirm("Вы уверены, что хотите отклонить автора туров?")) {
            // try {
            //     await fetch(`${server}/api/deleteUser/${id}`, {
            //         method: 'DELETE'
            //     });
            // } catch (error) {
            //     console.error('Ошибка при удалении автора туров:', error);
            // }
            // navigate('/admin/touragents');

            try {
                const response = await axios.post('/php/send_touragent_message.php', new URLSearchParams(form));
                alert(response.data);

            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
                alert('Произошла ошибка при отправке сообщения.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/php/send_mail.php', new URLSearchParams(form));
            alert(response.data);
            setForm({
                fio: '',
                phone: '',
                email: '',
                subject: '',
                comment: ''
            });
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            alert('Произошла ошибка при отправке сообщения.');
        }
    };

    return (
        <>
            <Header_black />

            {user ?
                <CenterBlock>
                    <WidthBlock>
                        <Link to={'/admin/touragents'} className={classes.backButton}><img src="/back.webp" alt="" />Вернуться назад</Link>
                        <div className={classes.blockUser}>
                            <div className={classes.logout}>
                                {user && !user.adminPanelAccess ?
                                    <>
                                        <div className={classes.buttonAccess} onClick={() => updateTouragent(token)}>Подтвердить</div>
                                        <div className={classes.buttonNonAccess} onClick={deleteElement}>Отклонить</div>
                                    </>
                                    :
                                    <>
                                        Аккаунт подтвержден
                                        {/* <div className={classes.buttonNonAccess} onClick={deleteElement}>Отклонить</div> */}
                                    </>
                                }
                            </div>

                            <div className={classes.blockUser_img}>
                                <img src="/noPhoto.png" alt="" />
                            </div>
                            <div className={classes.blockUser_info}>
                                {user.name}
                            </div>
                        </div>

                        <div className={classes.blockUser}>
                            <div className={classes.contacts}>
                                <H2 text_transform={'uppercase'}>Контакты</H2>

                                <div className={classes.contacts_elem}>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/phone.png" alt="" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.phone}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Телефон</div>
                                        </div>
                                    </div>
                                    <div className={classes.contacts_elem__item}>
                                        <div className={classes.contacts_elem__item___img}>
                                            <img src="/email.png" alt="" />
                                        </div>
                                        <div className={classes.contacts_elem__item___data}>
                                            <div className={classes.contacts_elem__item___data____title}>{user.email}</div>
                                            <div className={classes.contacts_elem__item___data____desc}>Почта</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WidthBlock>

                </CenterBlock>
                : null
            }
        </>
    );
}

export default ProfileTouragent;
