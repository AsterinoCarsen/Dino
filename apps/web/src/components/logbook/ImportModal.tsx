import { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportResult {
    sessionsCreated: number;
    ascentsCreated: number;
    rowsSkipped: number;
    overwrite: boolean;
}

type ImportState = 'idle' | 'loading' | 'success' | 'error';

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [state, setState] = useState<ImportState>('idle');
    const [result, setResult] = useState<ImportResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleClose = () => {
        if (state === 'success') {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        }
        setFile(null);
        setState('idle');
        setResult(null);
        setError('');
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
        setError('');
    };

    const handleImport = async () => {
        if (!file) return setError('Please select a CSV file.');

        const formData = new FormData();
        formData.append('file', file);

        setState('loading');

        try {
            const token = (await import('../../lib/store/authStore')).default.getState().token;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5028';

            const response = await fetch(`${baseUrl}/api/import/kaya?overwrite=false`, {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (response.status === 429) {
                setState('error');
                setError('Too many import requests. Please wait an hour before trying again.');
                return;
            }

            if (!response.ok) {
                const text = await response.text();
                setState('error');
                setError(text || `Import failed with status ${response.status}`);
                return;
            }

            const data: ImportResult = await response.json();
            setResult(data);
            setState('success');
        } catch (err) {
            setState('error');
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Import from KAYA</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {state === 'success' && result ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                            <p className="text-sm text-gray-300">Import completed successfully.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                                <p className="text-lg font-medium">{result.sessionsCreated}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-500 mb-1">Ascents</p>
                                <p className="text-lg font-medium">{result.ascentsCreated}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-500 mb-1">Skipped</p>
                                <p className="text-lg font-medium">{result.rowsSkipped}</p>
                            </div>
                        </div>
                        {result.rowsSkipped > 0 && (
                            <p className="text-xs text-gray-500">
                                Skipped rows are either duplicates or contained unrecognized data.
                            </p>
                        )}
                        <button
                            onClick={handleClose}
                            className="w-full bg-white text-black hover:bg-gray-100 font-medium py-2.5 rounded-xl transition text-sm"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-400">
                            Upload a CSV export from KAYA to import your climbing history. Duplicate ascents will be skipped automatically.
                        </p>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">KAYA Export (.csv)</label>
                            <label className={`flex items-center gap-3 w-full bg-white/5 border ${
                                file ? 'border-white/20' : 'border-white/10'
                            } rounded-xl px-4 py-3 cursor-pointer hover:border-white/20 transition`}>
                                <Upload size={16} className="text-gray-400 shrink-0" />
                                <span className="text-sm truncate">
                                    {file ? file.name : 'Choose a file...'}
                                </span>
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            onClick={handleImport}
                            disabled={state === 'loading' || !file}
                            className="w-full bg-white text-black disabled:opacity-50 hover:bg-gray-100 font-medium py-2.5 rounded-xl transition text-sm"
                        >
                            {state === 'loading' ? 'Importing...' : 'Import'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}