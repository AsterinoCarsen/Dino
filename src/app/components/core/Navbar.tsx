'use client';

import React from 'react';
import { useRouter } from "next/navigation";
import { LogOut } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const token = localStorage.getItem("token");

    const handleSignout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <nav className='sticky min-w-screen top-0 bg-paleYellow border-b-2 border-black text-white p-4 z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center text-black'>
                <h2>Dino.</h2>
                {token ? (
                    <button className='hover:text-red-500' onClick={handleSignout}>
                        <LogOut />
                    </button>
                ) : (
                    <div className='flex gap-4'>
                        <button className='btn-white font-extrabold p-8 py-2 rounded-full mt-4'>
                            Log In
                        </button>

                        <button className='btn-black font-extrabold p-8 py-2 rounded-full mt-4'>
                            Register
                        </button>
                    </div>
                )}


            </div>
        </nav>
    )
}