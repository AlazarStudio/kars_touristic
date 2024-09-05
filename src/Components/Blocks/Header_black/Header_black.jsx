import React, { useEffect, useState } from "react";
import classes from './Header_black.module.css';
import { Link } from "react-router-dom";

import logo from '/favicon_black.webp';
import arnament from '/header_arnament.webp';
import favourite from '/header_favourite_black.webp';
import cart from '/header_cart_black.webp';
import profile from '/header_profile_black.webp';
import burger from '/header_burger_black.webp';

import server from '../../../serverConfig';

function Header_black({ children, cartCount, ...props }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');

    const getUserInfo = async (token) => {
        if (token) {
            try {
                const response = await fetch(`${server}/api/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    return await response.json();
                } else {
                    throw new Error('Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                throw error;
            }
        }
    };

    useEffect(() => {
        getUserInfo(token)
            .then(userData => {
                setUser(userData);
            })
            .catch(error => console.error('Error initializing user:', error));
    }, [token])

    // window.scrollTo({
    //     top: 0,
    //     behavior: 'auto'
    // });

    return (
        <>
            <header className={classes.header}>
                <div className={classes.navigation}>
                    <Link to="/" className={classes.navigation_logo}>
                        <img src={logo} alt="Logo Kars Touristic" />
                    </Link>
                    <div className={classes.navigation_links}>
                        <ul>
                            <li><Link to="/about">О нас</Link></li>
                            <li><Link to="/transfer">Трансфер</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contacts">Контакты</Link></li>
                            <li><Link to="/turagents">Турагентам</Link></li>
                        </ul>
                    </div>
                    <div className={classes.navigation_btn}>
                        <ul>
                            <li><Link to="/favourites"><img src={favourite} alt="" /></Link></li>
                            <li><Link to="/profile"><img src={profile} alt="" /></Link></li>
                            {/* <li>
                                <Link to="/cart">
                                    <img src={cart} alt="" />
                                    {user && <div className={classes.cartCount}>{cartCount == 0 || cartCount ? cartCount : user && user.cart.length}</div>}
                                </Link>
                            </li> */}
                            <li className={classes.mobileHeader} onClick={toggleMenu}><img src={burger} alt="Menu" /></li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className={`${classes.mobileMenu} ${!menuOpen ? classes.mobileMenuClosed : ''}`}>
                <ul>
                    <li><Link to="/">Главная</Link></li>
                    <li><Link to="/about">О нас</Link></li>
                    <li><Link to="/transfer">Трансфер</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><Link to="/contacts">Контакты</Link></li>
                    <li><Link to="/turagents">Турагентам</Link></li>
                </ul>
            </div>
        </>
    );
}

export default Header_black;