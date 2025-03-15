'use client';

import React, { useState, useEffect } from 'react';

interface Ascension {
    aid: number;
    ascent_name: string;
    grade: string;
    attempts: number;
    created_at: string;
    ascension_type: string;
}

interface LogBookProps {
    uid: string;
}

export default function LogBook({ uid }: LogBookProps) {
    const [ascensions, setAscensions] = useState<Ascension[]>([]);

    useEffect(() => {
        if (uid) {
            fetchAscensions(uid);
        }
    }, [uid])

    const fetchAscensions = async (uid: string) => {
        try {
            const response = await fetch(`/api/ascents/getascents?uid=${uid}`);

            if (!response.ok) {
                throw new Error("Failed to fetch ascensions");
            }

            const data = await response.json();
            
            const sortedAscensions = data.sort((a: Ascension, b: Ascension) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setAscensions(sortedAscensions);
        } catch (error) {
            console.log("Error fetching ascensions:", error);
        }
    };

    return (
        <div>
            {ascensions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Route Name</th>
                                <th className="py-2 px-4 text-left">Grade</th>
                                <th className="py-2 px-4 text-left">Ascent Type</th>
                                <th className="py-2 px-4 text-left">Attempts</th>
                                <th className="py-2 px-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ascensions.map((asc, index) => (
                                <tr key={asc.aid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="py-2 px-4">{asc.ascent_name}</td>
                                    <td className="py-2 px-4">{asc.grade}</td>
                                    <td className="py-2 px-4">{asc.ascension_type}</td>
                                    <td className="py-2 px-4">{asc.attempts}</td>
                                    <td className="py-2 px-4">{new Date(asc.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No ascensions found.</p>
            )}
        </div>
    )
}