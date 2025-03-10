'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex flex-col items-center text-center p-10 w-96 max-w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 animate-fade-in">
            <h1 className="text-3xl font-bold text-white drop-shadow-md mb-6">🧗 Welcome to Dino!</h1>
            <p className="text-gray-300 text-sm mb-6">Join the adventure and explore the world of Dino.</p>
        
            <Link href="/login" className="w-full">
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold rounded-lg shadow-md mb-3">
                    Login
                </button>
            </Link>

            <Link href="/register" className="w-full">
                <button className="w-full py-3 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-lg shadow-md">
                    Register
                </button>
            </Link>
        </div>
    </div>
  );
}
