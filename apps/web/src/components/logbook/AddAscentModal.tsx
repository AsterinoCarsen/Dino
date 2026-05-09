import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Ascent } from '../../lib/types';
import { GRADE_SYSTEMS, GRADES, CLIMB_STYLES, GradeSystemType } from '../../lib/grades';

interface AddAscentModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number;
}

interface FormState {
    title: string;
    gradeSystem: GradeSystemType;
    grade: string;
    style: string;
    height: string;
    attempts: string;
    error: string;
}

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30";
const selectClass = "w-full bg-[#2a2a2a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer";

export default function AddAscentModal({ isOpen, onClose, sessionId }: AddAscentModalProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<FormState>({
        title: '',
        gradeSystem: 'VScale',
        grade: 'V0',
        style: 'Boulder',
        height: '',
        attempts: '1',
        error: '',
    });

    const mutation = useMutation({
        mutationFn: () => api.post<Ascent>('/api/ascent', {
            title: form.title,
            gradeSystem: form.gradeSystem,
            grade: form.grade,
            style: form.style,
            height: parseInt(form.height) || 0,
            attempts: parseInt(form.attempts) || 1,
            sessionId,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            handleClose();
        },
        onError: (err: Error) => {
            setForm(prev => ({ ...prev, error: err.message }));
        },
    });

    const handleClose = () => {
        setForm({
            title: '',
            gradeSystem: 'VScale',
            grade: 'V0',
            style: 'Boulder',
            height: '',
            attempts: '1',
            error: '',
        });
        onClose();
    };

    const handleGradeSystemChange = (system: GradeSystemType) => {
        setForm(prev => ({
            ...prev,
            gradeSystem: system,
            grade: GRADES[system][0],
        }));
    };

    const handleSubmit = () => {
        if (!form.title.trim()) {
            return setForm(prev => ({ ...prev, error: 'Title is required.' }));
        }
        if (form.title.length > 30) {
            return setForm(prev => ({ ...prev, error: 'Title must be 30 characters or less.' }));
        }
        const height = parseInt(form.height) || 0;
        if (height < 0 || height > 7500) {
            return setForm(prev => ({ ...prev, error: 'Height must be between 0 and 7500.' }));
        }
        const attempts = parseInt(form.attempts);
        if (!attempts || attempts < 1 || attempts > 1000) {
            return setForm(prev => ({ ...prev, error: 'Attempts must be between 1 and 1000.' }));
        }
        mutation.mutate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Add Ascent</h2>
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
                            placeholder="e.g. Slopers Anonymous"
                            className={inputClass}
                            value={form.title}
                            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Grade System</label>
                            <select
                                className={selectClass}
                                value={form.gradeSystem}
                                onChange={e => handleGradeSystemChange(e.target.value as GradeSystemType)}
                            >
                                {GRADE_SYSTEMS.map(system => (
                                    <option key={system} value={system} className="bg-[#2a2a2a]">{system}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Grade</label>
                            <select
                                className={selectClass}
                                value={form.grade}
                                onChange={e => setForm(prev => ({ ...prev, grade: e.target.value }))}
                            >
                                {GRADES[form.gradeSystem].map(grade => (
                                    <option key={grade} value={grade} className="bg-[#2a2a2a]">{grade}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Style</label>
                        <select
                            className={selectClass}
                            value={form.style}
                            onChange={e => setForm(prev => ({ ...prev, style: e.target.value }))}
                        >
                            {CLIMB_STYLES.map(style => (
                                <option key={style} value={style} className="bg-[#2a2a2a]">{style}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Height (m)</label>
                            <input
                                type="number"
                                min={0}
                                max={7500}
                                placeholder="0"
                                className={inputClass}
                                value={form.height}
                                onChange={e => setForm(prev => ({ ...prev, height: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Attempts</label>
                            <input
                                type="number"
                                min={1}
                                max={1000}
                                placeholder="1"
                                className={inputClass}
                                value={form.attempts}
                                onChange={e => setForm(prev => ({ ...prev, attempts: e.target.value }))}
                            />
                        </div>
                    </div>

                    {form.error && (
                        <p className="text-red-400 text-sm">{form.error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="w-full bg-white text-black disabled:opacity-50 hover:bg-gray-100 font-medium py-2.5 rounded-xl transition text-sm"
                    >
                        {mutation.isPending ? 'Adding...' : 'Add Ascent'}
                    </button>
                </div>
            </div>
        </div>
    );
}