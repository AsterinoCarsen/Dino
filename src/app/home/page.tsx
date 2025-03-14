'use client'

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    uid: string;
    username: string;
    exp: number;
}

interface Ascension {
    aid: number;
    grade: string;
    attempts: number;
    ascension_type: string;
}

export default function Home() {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<DecodedToken | null>(null);
    const [ascensions, setAscensions] = useState<Ascension[]>([]);
    const [newAscent, setNewAscent] = useState({
        grade: '',
        attempts: 1,
        ascension_type: ''
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);

            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                setUserData(decoded);
                fetchAscensions(decoded.uid);
            } catch (error) {
                console.error("Invalid token: ", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const fetchAscensions = async (uid: string) => {
        try {
            const response = await fetch(`/api/getascents?uid=${uid}`);

            if (!response.ok) {
                throw new Error("Failed to fetch ascensions");
            }

            const data = await response.json();
            setAscensions(data);
        } catch (error) {
            console.log("Error fetching ascensions:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    };

    return (
        <div>
            Welcome to the home page!
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>User ID: {userData.uid}</p>
                    <p>Token expires at: {new Date(userData.exp * 1000).toLocaleString()}</p>
                    {ascensions.length > 0 ? (
                        <ul>
                            {ascensions.map(ascension => (
                                <li key={ascension.aid}>{ascension.grade} {ascension.attempts}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No ascensions found.</p>
                    )}
                </div>
            ): (
                <div>
                    Please log in.
                </div>
            )}
        </div>
    )
}