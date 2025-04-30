import React, { useState, useEffect } from "react";
import classes from './ProfileTouragent.module.css';
import Header_black from "../../../Blocks/Header_black/Header_black";
import CenterBlock from "../../../Standart/CenterBlock/CenterBlock";
import WidthBlock from "../../../Standart/WidthBlock/WidthBlock";
import H2 from "../../../Standart/H2/H2";
import Modal from 'react-modal';
import server from '../../../../serverConfig';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

Modal.setAppElement('#root'); // Укажите ваш корневой элемент

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
    }
};

function ProfileTouragent({ children, ...props }) {
    let { id } = useParams();

    const [user, setUser] = useState();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [form, setForm] = useState({
        touragent: '',
        text: '',
    });

    let token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            getUserInfo(token);
        } else {
            navigate('/signIn');
        }
    }, [token]);

    const getUserInfo = async (token) => {
        const response = await fetch(`${server}/api/getOneTouragent/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setForm({ ...form, touragent: userData.email });
        } else {
            localStorage.removeItem('token');
            console.error('Ошибка получения информации о пользователе');
        }
    };

    const updateTouragent = async (token) => {
        const response = await fetch(`${server}/api/userUpdateAccess/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Автор туров подтвержден');
        } else {
            console.error('Ошибка получения информации о пользователе');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const deleteElement = async (e) => {
        setModalIsOpen(false);
        try {
            await fetch(`${server}/api/deleteUser/${id}`, {
                method: 'DELETE'
            });
            const response = await axios.post('/php/send_touragent_message.php', new URLSearchParams(form));
            alert(response.data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
        navigate('/admin/touragents');
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
                                        <div className={classes.buttonNonAccess} onClick={() => setModalIsOpen(true)}>Отклонить</div>
                                    </>
                                    :
                                    <>
                                        Аккаунт подтвержден
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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={customStyles}
                contentLabel="Причина отказа"
            >
                <h2>Причина отказа</h2>
                <textarea
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    placeholder="Напишите причину отказа"
                    style={{ 
                        width: '100%', 
                        height: '100px', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        marginTop: '20px', 
                        outline: 'none',
                        resize: 'vertical',
                        maxHeight: '500px'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '20px' }}>
                    <button onClick={deleteElement} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#f44336', color: '#fff', cursor: 'pointer' }}>Отправить</button>
                    <button onClick={() => setModalIsOpen(false)} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' }}>Отмена</button>
                </div>
            </Modal>
        </>
    );
}

export default ProfileTouragent;
