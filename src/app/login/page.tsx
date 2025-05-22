'use client';

import React from 'react';
import Login from '../components/authentication/LoginForm';
import Navbar from '../components/core/Navbar';

export default function LoginPage() {
    return (
        <div className='flex w-screen h-screen justify-center items-center'>
            <Navbar />
            <Login />
        </div>
    )
}