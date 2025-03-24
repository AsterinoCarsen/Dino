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
        <nav className='sticky top-0 bg-paleYellow border-b-2 border-black text-white p-4 z-50'>
            <div className='max-w-7xl mx-auto flex justify-between items-center text-black'>
                <h3>Dino.</h3>
                {token && (
                    <button className='hover:text-red-500' onClick={handleSignout}>
                        <LogOut />
                    </button>
                )}
            </div>
        </nav>
    )
}