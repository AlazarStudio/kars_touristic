import React, { useState, useEffect } from "react";

import Header_black from "../Blocks/Header_black/Header_black"

function Admin_Page({ children, ...props }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/getUsers');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });

    return (
        <>
            <Header_black />
            <h1>Users</h1>
            <ul>
                {users.map((item, index) => (
                    <li key={index}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Admin_Page;