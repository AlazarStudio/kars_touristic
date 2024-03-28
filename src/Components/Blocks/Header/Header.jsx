import React from "react";
import classes from './Header.module.css';
import { Link } from "react-router-dom";

import logo from '/public/favicon.png';
import arnament from '/public/header_arnament.png';
import favourite from '/public/header_favourite.png';
import cart from '/public/header_cart.png';
import profile from '/public/header_profile.png';

function Header({ children, ...props }) {
    return ( 
        <>
            <header>
                <img src={arnament} alt="" />
                <div className={classes.navigation}>
                    <Link to="/" className="navigation_logo">
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
                        </ul>
                    </div>

                </div>
            </header>
        </>
     );
}

export default Header;