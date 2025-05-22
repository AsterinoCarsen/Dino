'use client';

import React from 'react';
import Register from '../components/authentication/RegisterForm';
import Navbar from '../components/core/Navbar';

export default function RegisterPage() {
    return (
        <div className='flex w-screen h-screen justify-center items-center'>
            <Navbar />
            <Register />
        </div>
    )
}