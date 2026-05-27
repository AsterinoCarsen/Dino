import { X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    isPending?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    isPending = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-white flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <p className="text-sm text-gray-400">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-white/10 text-gray-400 hover:text-white py-2.5 rounded-xl transition text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 disabled:opacity-50 font-medium py-2.5 rounded-xl transition text-sm"
                    >
                        {isPending ? 'Deleting...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}