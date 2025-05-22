import React from 'react';
import { motion } from "framer-motion";

/**
 * A spinning loading animation.
 * @returns 
 */
export default function Loading() {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <motion.div
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity , duration: 1, ease: "linear" }}
            className='w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full'
            />
        </div>
    )
}