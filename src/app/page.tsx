'use client';

import Link from 'next/link';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function Home() {
  return (
    <div className="flex w-screen h-screen">
        <div className='flex pl-20 w-1/2 h-full'>
            <RegisterForm />
        </div>

        <div className='flex pr-20 w-1/2 h-full bg-lightYellow'>
            <LoginForm />
        </div>
    </div>
  );
}
