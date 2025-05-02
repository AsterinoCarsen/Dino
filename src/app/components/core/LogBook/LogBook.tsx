'use client';

import '@mantine/core/styles.css';

import React, { useState, useEffect, FormEvent } from 'react';
import { Plus } from "lucide-react";
import Loading from '../../misc/Loading';

import { Button, MantineProvider } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import RouteTable from './RouteTable';
import LogBookModal from './LogBookModal';

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

    const [ascentName, setAscentName] = useState<string | null>(null);
    const [grade, setGrade] = useState<string>("");
    const [attempts, setAttempts] = useState<number>(1);
    const [ascentType, setAscentType] = useState<string | null>(null);
    const [elo, setElo] = useState<number | null>(null);

    const [deletingRow, setDeletingRow] = useState<number | null>(null);

    const [opened, {open, close}] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
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

            await response.json();

            if (!response.ok) {
                throw new Error("Failed to add ascent.");
            }

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

            await response.json();

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

    return (
        <MantineProvider>
            <LogBookModal 
                opened={opened}
                onClose={close}
                onSubmit={handleSubmit}
                setAscentName={(val) => setAscentName(val)}
                setGrade={(val) => setGrade(val)}
                setAttempts={(val) => setAttempts(val)}
                setAscentType={(val) => setAscentType(val)}
            />

            <div className='flex justify-end mb-2'>
                <Button onClick={open} className="btn-black text-white p-2 rounded-full shadow-md">
                    <Plus size={24} />
                </Button>
            </div>

            {isLoading ? (
                <Loading />
            ): ascensions.length > 0 ? (
                <RouteTable
                    elo={elo}
                    ascensions={ascensions}
                    deletingRow={deletingRow}
                    handleDelete={handleDelete}
                />
            ) : (
                <div className='text-center text-gray-500 mt-4'>No ascensions logged yet.</div>
            )}
        </MantineProvider>
    )
}