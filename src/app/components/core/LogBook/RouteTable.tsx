import React from 'react';

import EloDisplay from '../../misc/EloDisplay';
import { ScrollArea } from '@mantine/core';
import { Trash } from 'lucide-react';

interface Ascension {
    aid: number;
    ascent_name: string;
    grade: string;
    attempts: number;
    created_at: string;
    ascension_type: string;
};

interface RouteTableProps {
    elo: number | null;
    ascensions: Ascension[];
    deletingRow: number | null;
    handleDelete: (e: React.FormEvent, aid: number) => void;
}

export default function RouteTable({ elo, ascensions, deletingRow, handleDelete }: RouteTableProps ) {

    return (
        <ScrollArea h={400} scrollbarSize={8} type="auto">
            {elo !== null && (
                <EloDisplay elo={elo} />
            )}
            <div className='max-h-96 overflow-y-auto scrollbar-hide'>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-black">
                            <th className="py-2 px-4 text-left">Route Name</th>
                            <th className="py-2 px-4 text-left">Grade</th>
                            <th className="py-2 px-4 text-left">Ascent Type</th>
                            <th className="py-2 px-4 text-left">Attempts</th>
                            <th className="py-2 px-4 text-left">Date</th>
                            <th className="py-2 px-4 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ascensions.map((asc, index) => (
                            <tr key={asc.aid} className={`transition-colors duration-500 
                                                ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} 
                                                ${deletingRow === asc.aid ? 'bg-gray-300' : ''}`}>
                                <td className="py-2 px-4">{asc.ascent_name}</td>
                                <td className="py-2 px-4">{asc.grade}</td>
                                <td className="py-2 px-4">{asc.ascension_type}</td>
                                <td className="py-2 px-4">{asc.attempts}</td>
                                <td className="py-2 px-4">{new Date(asc.created_at).toLocaleDateString()}</td>
                                <td className="py-2 px-4">
                                    <button className='hover:text-red-500' onClick={(e) => handleDelete(e, asc.aid)}><Trash className='w-5 h-5' /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ScrollArea>
    );
}