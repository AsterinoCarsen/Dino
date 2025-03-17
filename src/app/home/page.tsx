'use client'

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import LogBook from '../components/LogBook';

interface DecodedToken {
    uid: string;
    username: string;
    exp: number;
}

export default function Home() {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);

            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                setUserData(decoded);
            } catch (error) {
                console.error("Invalid token: ", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    return (
        <div>
            {userData ? (
                <div className='flex flex-col pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12'>
                    <h1 className='pb-20'>Welcome, {userData.username}</h1>
                    <LogBook uid={userData.uid} />
                </div>
            ): (
                <p>Please log in...</p>
            )}
        </div>
    )
}