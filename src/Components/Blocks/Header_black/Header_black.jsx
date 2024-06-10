import React, { useState } from "react";
import classes from './Header_black.module.css';
import { Link } from "react-router-dom";

import logo from '/favicon_black.webp';
import arnament from '/header_arnament.webp';
import favourite from '/header_favourite_black.webp';
import cart from '/header_cart_black.webp';
import profile from '/header_profile_black.webp';
import burger from '/header_burger_black.webp';

function Header_black({ children, ...props }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
                            <li><Link to="/profile"><img src={profile} alt="" /></Link></li>
                            <li><Link to="/favourites"><img src={favourite} alt="" /></Link></li>
                            <li><Link to="/cart"><img src={cart} alt="" /></Link></li>
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