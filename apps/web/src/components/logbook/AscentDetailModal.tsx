import { X, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Ascent } from '../../lib/types';

interface AscentDetailModalProps {
    ascent: Ascent | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStyleColor = (style: string) => {
    switch (style) {
        case 'AutoBelay': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'TopRope': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        case 'Lead': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'Boulder': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
};

const getGradeSystemLabel = (system: string) => {
    switch (system) {
        case 'VScale': return 'V-Scale';
        case 'YDS': return 'Yosemite Decimal System';
        case 'French': return 'French';
        default: return system;
    }
};

export default function AscentDetailModal({ ascent, isOpen, onClose }: AscentDetailModalProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/api/ascent/${ascent!.id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            onClose();
        },
        onError: (err: Error) => {
            console.error('Failed to delete ascent:', err.message);
        },
    });

    if (!isOpen || !ascent) return null;

    const loggedDate = new Date(ascent.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const isFlash = ascent.attempts === 1;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col gap-5">

                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-medium">{ascent.title}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{loggedDate}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm border border-white/10 px-3 py-1 rounded-full font-medium">
                        {ascent.grade}
                    </span>
                    <span className={`text-xs border px-3 py-1 rounded-full ${getStyleColor(ascent.style)}`}>
                        {ascent.style}
                    </span>
                    {isFlash && (
                        <span className="text-xs border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">
                            Flash
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Grade System</p>
                        <p className="text-sm font-medium">{getGradeSystemLabel(ascent.gradeSystem)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Grade</p>
                        <p className="text-sm font-medium">{ascent.grade}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Attempts</p>
                        <p className="text-sm font-medium">
                            {ascent.attempts} {ascent.attempts === 1 ? 'attempt' : 'attempts'}
                            {isFlash && <span className="text-yellow-400 ml-1.5 text-xs">— Flash!</span>}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Height</p>
                        <p className="text-sm font-medium">{ascent.height}m</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <p className="text-xs text-gray-500">Session #{ascent.sessionId}</p>
                    <button
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
                    >
                        <Trash2 size={13} />
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete ascent'}
                    </button>
                </div>

            </div>
        </div>
    );
}