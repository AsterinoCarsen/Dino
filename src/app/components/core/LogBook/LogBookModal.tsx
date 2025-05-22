import React from 'react';

import { Modal } from '@mantine/core';
import GradeOptions from '../../misc/GradeOptions';

interface LogBookModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setAscentName: (value: string) => void;
    setGrade: (value: string) => void;
    setAttempts: (value: number) => void;
    setAscentType: (value: string) => void;
}

export default function LogBookModal({ 
    opened,
    onClose,
    onSubmit,
    setAscentName,
    setGrade,
    setAttempts,
    setAscentType
 }: LogBookModalProps) {
    return (
        <Modal 
            yOffset="15vh" 
            overlayProps={{backgroundOpacity: 0.55, blur: 3}} 
            opened={opened} 
            onClose={onClose} 
            title="Log New Ascent"
            centered
            styles={{
                title: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }
            }}
        >
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
                onClose();
            }}
            className='rounded-lg shadow-lg flex flex-col gap-4'>
                <label className="flex flex-col">
                    Ascent Name (Optional)
                    <input 
                        type="text" 
                        className="border p-2 rounded" 
                        placeholder="Ascent Name"
                        onChange={(e) => setAscentName(e.target.value)}
                    />
                </label>
        
                <label className="flex flex-col">
                    Grade
                    <GradeOptions setGrade={setGrade} />
                </label>
        
                <label className="flex flex-col">
                    Attempts
                    <input 
                        type="number" 
                        className="border p-2 rounded" 
                        placeholder="Number of attempts"
                        min="0"
                        max="1000"
                        onChange={(e) => setAttempts(Number(e.target.value))}
                        required
                    />
                </label>
        
                <label className="flex flex-col">
                    Ascent Type (Optional)
                    <select
                        className="border p-2 rounded"
                        defaultValue=""
                        onChange={(e) => setAscentType(e.target.value)}
                    >
                            <option value="" disabled>Select an ascent type</option>
                            <option value="Boulder">Boulder</option>
                            <option value="Top Rope">Top Rope</option>
                            <option value="Lead">Lead</option>
                            <option value="Auto Belay">Auto Belay</option>
                    </select>
                </label>
        
                <div className="flex justify-end gap-2">
                    <button 
                        type="submit" 
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    )
}