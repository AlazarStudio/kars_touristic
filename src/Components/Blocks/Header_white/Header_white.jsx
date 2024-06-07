import React, { useState } from "react";
import classes from './Header_white.module.css';
import { Link } from "react-router-dom";

import logo from '/favicon.png';
import arnament from '/header_arnament.png';
import favourite from '/header_favourite.png';
import cart from '/header_cart.png';
import profile from '/header_profile.png';
import burger from '/header_burger.png';

function Header_white({ children, ...props }) {
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
                            <li><Link to="/profile"><img src={favourite} alt="" /></Link></li>
                            <li><Link to="/favourites"><img src={profile} alt="" /></Link></li>
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

export default Header_white;
