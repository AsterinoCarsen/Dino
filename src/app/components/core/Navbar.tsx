'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { LogOut } from 'lucide-react';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    const handleSignout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
            setToken(null);
        }
        router.push("/");
    };

    const handleGoRegister = () => {
        router.push("/register");
    }

    const handleGoLogin = () => {
        router.push("/login");
    }

    return (
        <nav className='fixed top-0 left-0 w-full bg-white p-4 z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center text-black'>
                <h2>Dino.</h2>
                {token ? (
                    <button className='btn-black font-extrabold p-8 py-2 rounded-full mt-4' onClick={handleSignout}>
                        Sign Out
                    </button>
                ) : (
                    <div className='flex gap-4'>
                        <button onClick={handleGoLogin} className='btn-white font-extrabold p-8 py-2 rounded-full mt-4'>
                            Log In
                        </button>

                        <button onClick={handleGoRegister} className='btn-black font-extrabold p-8 py-2 rounded-full mt-4'>
                            Register
                        </button>
                    </div>
                )}


            </div>
        </nav>
    )
}