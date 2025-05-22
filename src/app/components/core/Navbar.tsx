'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight } from 'lucide-react';

import { Button, MantineProvider } from '@mantine/core';

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

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

    const handleGoHome = () => {
        router.push("/");
    }

    const isAuthPage = pathname === '/login' || pathname === '/register';

    return (
        <MantineProvider>
            <nav className='fixed top-0 left-0 w-full p-4 z-50'>
                <div className='max-w-7xl mx-auto flex justify-between items-center text-black'>
                    <h2>Dino.</h2>
                    {token ? (
                        <Button onClick={handleSignout} variant="filled" size="md">
                            Sign Out
                        </Button>
                    ) : isAuthPage ? (
                        <Button onClick={handleGoHome} variant="outline" size="md">
                            <ArrowRight />
                        </Button>
                    ) : (
                        <div className='flex gap-12'>
                            <Button onClick={handleGoLogin} variant="outline" size="md">
                                Log In
                            </Button>

                            <Button onClick={handleGoRegister} variant="filled" size="md">
                                Register
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </MantineProvider>
    )
}