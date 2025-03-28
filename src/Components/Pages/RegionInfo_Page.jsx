import React, { useEffect, useState } from "react";
import RegionInfo from "../Blocks/RegionInfo/RegionInfo";
import server from '../../serverConfig';
import Header_black from "../Blocks/Header_black/Header_black";


function RegionInfo_Page({ children, ...props }) {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

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
        if (token) {
            getUserInfo(token)
                .then(userData => {
                    setUser(userData);
                    setCartCount(userData.cart.length)
                })
                .catch(error => console.error('Error initializing user:', error));
        }
    }, [token])



    return (
        <>
            <Header_black cartCount={cartCount} />
            <RegionInfo setCartCount={setCartCount} />
        </>
    );
}

export default RegionInfo_Page;