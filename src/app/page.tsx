'use client';

import LoginForm from "./components/authentication/LoginForm";
import RegisterForm from "./components/authentication/RegisterForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center bg-paleWhite w-full min-h-screen">
        <h1 className="place-self-center">Welcome to Dino.</h1>
        <div className="flex w-full max-w-7xl">
            <div className='flex w-1/2 h-full border-r-2 border-gray-200'>
                <RegisterForm />
            </div>

            <div className='flex w-1/2 h-full'>
                <LoginForm />
            </div>
        </div>
    </div>
  );
}
