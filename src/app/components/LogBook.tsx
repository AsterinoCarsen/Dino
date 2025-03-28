'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Plus, Trash } from "lucide-react";
import Loading from './Loading';
import EloDisplay from './EloDisplay';
import GradeOptions from './GradeOptions';

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
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const [ascentName, setAscentName] = useState<string | null>(null);
    const [grade, setGrade] = useState<string>("");
    const [attempts, setAttempts] = useState<number>(1);
    const [ascentType, setAscentType] = useState<string | null>(null);
    const [elo, setElo] = useState<number | null>(null);

    const [deletingRow, setDeletingRow] = useState<number | null>(null);

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

            const { data, elo } = await response.json();
            
            const sortedAscensions = data.sort((a: Ascension, b: Ascension) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setElo(elo);
            setAscensions(sortedAscensions);
        } catch (error) {
            console.log("Error fetching ascensions:", error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const ascentData = {
            uid,
            ascentName,
            grade,
            attempts,
            ascentType
        };

        try {
            const response = await fetch("/api/ascents/addascent", {
                method: "POST",
                body: JSON.stringify(ascentData)
            });

            if (!response.ok) {
                throw new Error("Failed to add ascent.");
            }

            setModalVisible(false);
            fetchAscensions(uid);
        } catch (error) {
            console.error("Error adding ascent: ", error);
        }
    };

    const handleDelete = async (e: FormEvent, aid: number) =>  {
        e.preventDefault();
        setDeletingRow(aid);

        try {
            const response = await fetch("/api/ascents/deleteascent", {
                method: "DELETE",
                body: JSON.stringify({ aid })
            });

            if (!response.ok) {
                throw new Error("Failed to delete ascent.");
            }

            setTimeout(() => {
                fetchAscensions(uid);
                setDeletingRow(null);
            }, 500);
        } catch (error) {
            console.error("Error adding ascent: ", error);
        }
    };

    const toggleModal = () => {
        setModalVisible(prev => ! prev);
    };

    return (
        <div>
            {isModalVisible && (
                <div className='fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-custom'>
                    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-96'>
                        <h2 className="text-xl font-semibold">Log New Ascent</h2>
            
                        <label className="flex flex-col">
                            Ascent Name (Optional)
                            <input 
                                type="text" 
                                className="border p-2 rounded" 
                                placeholder="Ascent Name"
                                onChange={(e) => setAscentName(e.target.value)}
                            />
                        </label>

                        <label className="flex flex-col">
                            Grade
                            <GradeOptions setGrade={setGrade} />
                        </label>

                        <label className="flex flex-col">
                            Attempts
                            <input 
                                type="number" 
                                className="border p-2 rounded" 
                                placeholder="Number of attempts"
                                min="0"
                                max="1000"
                                onChange={(e) => setAttempts(Number(e.target.value))}
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            Ascent Type (Optional)
                            <select
                                className="border p-2 rounded"
                                defaultValue=""
                                onChange={(e) => setAscentType(e.target.value)}
                            >
                                    <option value="" disabled>Select an ascent type</option>
                                    <option value="Boulder">Boulder</option>
                                    <option value="Top Rope">Top Rope</option>
                                    <option value="Lead">Lead</option>
                                    <option value="Auto Belay">Auto Belay</option>
                            </select>
                        </label>

                        <div className="flex justify-end gap-2">
                            <button 
                                type="button" 
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className='flex justify-end mb-2'>
                <button onClick={toggleModal} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md">
                    <Plus size={24} />
                </button>
            </div>
            {ascensions.length > 0 ? (
                <div className="overflow-x-auto">
                    {elo !== null && (
                        <EloDisplay elo={elo} />
                    )}
                    <div className='max-h-96 overflow-y-auto'>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 text-left">Route Name</th>
                                    <th className="py-2 px-4 text-left">Grade</th>
                                    <th className="py-2 px-4 text-left">Ascent Type</th>
                                    <th className="py-2 px-4 text-left">Attempts</th>
                                    <th className="py-2 px-4 text-left">Date</th>
                                    <th className="py-2 px-4 text-left">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ascensions.map((asc, index) => (
                                    <tr key={asc.aid} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} transition-colors duration-500 ${deletingRow === asc.aid ? 'bg-gray-300' : ''}`}>
                                        <td className="py-2 px-4">{asc.ascent_name}</td>
                                        <td className="py-2 px-4">{asc.grade}</td>
                                        <td className="py-2 px-4">{asc.ascension_type}</td>
                                        <td className="py-2 px-4">{asc.attempts}</td>
                                        <td className="py-2 px-4">{new Date(asc.created_at).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">
                                            <button className='hover:text-red-500' onClick={(e) => handleDelete(e, asc.aid)}><Trash className='w-5 h-5' /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    )
}