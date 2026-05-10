import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Session } from '../../lib/types';

interface NewSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (session: Session) => void;
}

interface FormState {
    location: string;
    notes: string;
    error: string;
}

export default function NewSessionModal({ isOpen, onClose, onSuccess }: NewSessionModalProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<FormState>({
        location: '',
        notes: '',
        error: '',
    });

    const mutation = useMutation({
        mutationFn: () => api.post<Session>('/api/session', {
            location: form.location,
            notes: form.notes,
        }),
        onSuccess: (session) => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            onSuccess(session);
            handleClose();
        },
        onError: (err: Error) => {
            setForm(prev => ({ ...prev, error: err.message }));
        },
    });

    const handleClose = () => {
        setForm({ location: '', notes: '', error: '' });
        onClose();
    };

    const handleSubmit = () => {
        if (!form.location.trim()) {
            return setForm(prev => ({ ...prev, error: 'Location is required.' }));
        }
        if (form.location.length > 75) {
            return setForm(prev => ({ ...prev, error: 'Location must be 75 characters or less.' }));
        }
        if (form.notes.length > 150) {
            return setForm(prev => ({ ...prev, error: 'Notes must be 150 characters or less.' }));
        }
        mutation.mutate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">New Session</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Location <span className="text-gray-600">({form.location.length}/75)</span>
                        </label>
                        <input
                            type="text"
                            maxLength={75}
                            placeholder="e.g. Alta Climbing"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                            value={form.location}
                            onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Notes <span className="text-gray-600">({form.notes.length}/150)</span>
                        </label>
                        <textarea
                            maxLength={150}
                            rows={3}
                            placeholder="How did the session go?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 resize-none"
                            value={form.notes}
                            onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>

                    {form.error && (
                        <p className="text-red-400 text-sm">{form.error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="w-full bg-white text-black disabled:opacity-50 hover:bg-gray-100 font-medium py-2.5 rounded-xl transition text-sm"
                    >
                        {mutation.isPending ? 'Creating...' : 'Create Session'}
                    </button>
                </div>
            </div>
        </div>
    );
}