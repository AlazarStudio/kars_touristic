import React, { useEffect, useState } from "react";
import classes from './Header_black.module.css';
import { Link, useLocation } from "react-router-dom";

// import logo from '/favicon_black.webp';
import arnament from '/header_arnament.webp';
import favourite from '/header_favourite_black.webp';
import cart from '/header_cart_black.webp';
import profile from '/header_profile_black.webp';
import burger from '/header_burger_black.webp';

import server from '../../../serverConfig';

function Header_black({ children, cartCount, tempMain, ...props }) {
    const [menuOpen, setMenuOpen] = useState(false);
    let pageName = useLocation().pathname;

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
            {!tempMain &&
                <>
                    <header className={classes.header}>
                        <div className={classes.navigation}>
                            <Link to="/" className={classes.navigation_logo}>
                                <img src={'/logo33.png'} alt="Logo Kars Touristic" />
                                
                            </Link>
                            <div className={classes.navigation_links}>
                                <ul>
                                    <li><Link to="/about" className={`${pageName == '/about' && classes.activeLink}`}>О нас</Link></li>
                                    <li><Link to="/transfer" className={`${pageName == '/transfer' && classes.activeLink}`}>Трансфер</Link></li>
                                    <li><Link to="/faq" className={`${pageName == '/faq' && classes.activeLink}`}>FAQ</Link></li>
                                    <li><Link to="/contacts" className={`${pageName == '/contacts' && classes.activeLink}`}>Контакты</Link></li>
                                    <li><Link to="/turagents" className={`${pageName == '/turagents' && classes.activeLink}`}>Турагентам</Link></li>
                                    <li><Link to="/partners" className={`${pageName == '/partners' && classes.activeLink}`}>Партнеры</Link></li>
                                </ul>
                            </div>
                            <div className={classes.navigation_btn}>
                                <ul>
                                    {/* <li><Link to="/favourites"><img src={favourite} alt="" /></Link></li> */}
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
                            <li><Link to="/partners">Партнеры</Link></li>
                        </ul>
                    </div>
                </>
            }
        </>
    );
}

export default Header_black;