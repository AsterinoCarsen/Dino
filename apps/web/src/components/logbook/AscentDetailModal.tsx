import { useState } from 'react';
import { X, Trash2, Pencil } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Ascent } from '../../lib/types';
import { GRADE_SYSTEMS, GRADES, CLIMB_STYLES } from '../../lib/grades';

interface AscentDetailModalProps {
    ascent: Ascent | null;
    isOpen: boolean;
    onClose: () => void;
}

interface EditFormState {
    title: string;
    gradeSystem: string;
    grade: string;
    style: string;
    height: string;
    attempts: string;
    error: string;
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
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<EditFormState>({
        title: '',
        gradeSystem: '',
        grade: '',
        style: '',
        height: '',
        attempts: '',
        error: '',
    });

    const openEdit = () => {
        if (!ascent) return;
        setForm({
            title: ascent.title,
            gradeSystem: ascent.gradeSystem,
            grade: ascent.grade,
            style: ascent.style,
            height: ascent.height.toString(),
            attempts: ascent.attempts.toString(),
            error: '',
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setForm({ title: '', gradeSystem: '', grade: '', style: '', height: '', attempts: '', error: '' });
    };

    const handleClose = () => {
        cancelEdit();
        onClose();
    };

    const deleteMutation = useMutation({
        mutationFn: () => api.delete(`/api/ascent/${ascent!.id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            handleClose();
        },
        onError: (err: Error) => {
            console.error('Failed to delete ascent:', err.message);
        },
    });

    const editMutation = useMutation({
        mutationFn: () => api.put<Ascent>(`/api/ascent/${ascent!.id}`, {
            title: form.title,
            gradeSystem: form.gradeSystem,
            grade: form.grade,
            style: form.style,
            height: parseInt(form.height),
            attempts: parseInt(form.attempts),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            handleClose();
        },
        onError: (err: Error) => {
            setForm(prev => ({ ...prev, error: err.message }));
        },
    });

    const handleEditSubmit = () => {
        if (!form.title.trim()) return setForm(prev => ({ ...prev, error: 'Title is required.' }));
        if (form.title.length > 30) return setForm(prev => ({ ...prev, error: 'Title must be 30 characters or less.' }));
        const height = parseInt(form.height);
        const attempts = parseInt(form.attempts);
        if (isNaN(height) || height < 0) return setForm(prev => ({ ...prev, error: 'Height must be a positive number.' }));
        if (isNaN(attempts) || attempts < 1) return setForm(prev => ({ ...prev, error: 'Attempts must be at least 1.' }));
        editMutation.mutate();
    };

    if (!isOpen || !ascent) return null;

    const loggedDate = new Date(ascent.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

    const isFlash = ascent.attempts === 1;
    const availableGrades = GRADES[form.gradeSystem as keyof typeof GRADES] ?? [];

    if (isEditing) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">Edit Ascent</h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Title <span className="text-gray-600">({form.title.length}/30)</span>
                            </label>
                            <input
                                type="text"
                                maxLength={30}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Grade System</label>
                                <select
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                                    value={form.gradeSystem}
                                    onChange={e => setForm(prev => ({ ...prev, gradeSystem: e.target.value, grade: '' }))}
                                >
                                    {GRADE_SYSTEMS.map(s => (
                                        <option key={s} value={s} className="bg-[#2a2a2a]">{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Grade</label>
                                <select
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                                    value={form.grade}
                                    onChange={e => setForm(prev => ({ ...prev, grade: e.target.value }))}
                                >
                                    {availableGrades.map(g => (
                                        <option key={g} value={g} className="bg-[#2a2a2a]">{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Style</label>
                                <select
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                                    value={form.style}
                                    onChange={e => setForm(prev => ({ ...prev, style: e.target.value }))}
                                >
                                    {CLIMB_STYLES.map(s => (
                                        <option key={s} value={s} className="bg-[#2a2a2a]">{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Attempts</label>
                                <input
                                    type="number"
                                    min={1}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                                    value={form.attempts}
                                    onChange={e => setForm(prev => ({ ...prev, attempts: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Height (m)</label>
                            <input
                                type="number"
                                min={0}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
                                value={form.height}
                                onChange={e => setForm(prev => ({ ...prev, height: e.target.value }))}
                            />
                        </div>

                        {form.error && <p className="text-red-400 text-sm">{form.error}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={cancelEdit}
                                className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editMutation.isPending}
                                className="flex-1 bg-white text-black disabled:opacity-50 hover:bg-gray-100 font-medium py-2.5 rounded-xl transition text-sm"
                            >
                                {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col gap-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-medium">{ascent.title}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{loggedDate}</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={openEdit}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
                        >
                            <Pencil size={13} />
                            Edit
                        </button>
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
        </div>
    );
}