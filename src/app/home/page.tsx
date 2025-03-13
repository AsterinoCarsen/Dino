'use client'

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

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
            Welcome to the home page!
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>User ID: {userData.uid}</p>
                    <p>Token expires at: {new Date(userData.exp * 1000).toLocaleString()}</p>
                </div>
            ): (
                <div>
                    Please log in.
                </div>
            )}
        </div>
    )
}