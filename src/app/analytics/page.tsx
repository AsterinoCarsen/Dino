'use client';

import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import AttemptsPerGrade from '../components/analytics/AttemptsPerGrade';
import Loading from '../components/misc/Loading';

interface DecodedToken {
    uid: string;
    username: string;
    exp: number;
}

interface Ascension {
    aid: number;
    ascent_name: string;
    grade: string;
    attempts: number;
    created_at: string;
    ascension_type: string;
}

export default function Analytics() {
    const [uid, setUID] = useState<string>("");
    const [data, setData] = useState<Ascension[]>();
    const [elo, setElo] = useState();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            const decoded: DecodedToken = jwtDecode(storedToken);
            setUID(decoded.uid);
            fetchAscensions(decoded.uid);
        }
    }, []);

    const fetchAscensions = async (uid: string) => {
        if (!uid) return;

        try {
            const response = await fetch(`/api/ascents/getascents?uid=${uid}`)

            if (!response.ok) {
                throw new Error("Failed to fetch ascensions.");
            }

            const { data, elo } = await response.json();
            setData(data);
            setElo(elo);
        } catch (error) {
            console.log("Error fetching ascensions.", error);
        }
    }

    return (
        <div className='flex w-screen h-screen flex-col justify-center items-center p-4'>
            {data && uid ? (
                <div>
                    <AttemptsPerGrade ascensions={data} />
                </div>
            ): (
                <Loading />
            )}
        </div>
    )
}