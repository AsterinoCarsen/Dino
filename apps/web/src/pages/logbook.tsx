import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, MapPin, Calendar, Pencil, Trash2, Upload, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNav from '../components/TopNav';
import NewSessionModal from '../components/logbook/NewSessionModal';
import AddAscentModal from '../components/logbook/AddAscentModal';
import AscentDetailModal from '../components/logbook/AscentDetailModal';
import ImportModal from '@/components/logbook/ImportModal';
import ConfirmModal from '@/components/logbook/ConfirmModal';
import { useSessions } from '../lib/queries';
import { Session, Ascent } from '../lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function Logbook() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: sessions, isLoading } = useSessions();
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [selectedAscent, setSelectedAscent] = useState<Ascent | null>(null);
    const [newSessionOpen, setNewSessionOpen] = useState(false);
    const [editSessionOpen, setEditSessionOpen] = useState(false);
    const [addAscentOpen, setAddAscentOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [deleteSessionOpen, setDeleteSessionOpen] = useState(false);
    const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

    useEffect(() => {
        if (!sessions || sessions.length == 0) return;

        const queryId = router.query.session
            ? parseInt(router.query.session as string)
            : null;

        if (queryId && sessions.find(s => s.id === queryId)) {
            setSelectedSessionId(queryId);
            setMobileView('detail');
        } else {
            setSelectedSessionId(sessions[0].id);
        }
    }, [sessions, router.query.session]);

    const selectedSession: Session | null =
        sessions?.find(s => s.id === selectedSessionId)
        ?? sessions?.[0]
        ?? null;

    const deleteSessionMutation = useMutation({
        mutationFn: () => api.delete(`/api/session/${selectedSession!.id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            setSelectedSessionId(null);
            setDeleteSessionOpen(false);
            setMobileView('list');
        },
        onError: (err: Error) => {
            console.error('Failed to delete session:', err.message);
            setDeleteSessionOpen(false);
        },
    });

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
        });

    const formatShortDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });

    const getStyleColor = (style: string) => {
        switch (style) {
            case 'AutoBelay': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'TopRope': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Lead': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Boulder': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const sessionList = (
        <div className="border border-dino-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-dino-border">
                <p className="font-medium">Sessions</p>
                <p className="text-sm text-gray-400">{sessions?.length ?? 0} total sessions</p>
            </div>
            <div className="divide-y divide-dino-border">
                {sessions?.map(session => {
                    const isSelected = (selectedSessionId ?? sessions[0]?.id) === session.id;
                    return (
                        <div
                            key={session.id}
                            onClick={() => {
                                setSelectedSessionId(session.id);
                                setMobileView('detail');
                            }}
                            className={`px-5 py-4 cursor-pointer transition ${
                                isSelected
                                    ? 'border-l-2 border-emerald-500 bg-white/5'
                                    : 'border-l-2 border-transparent hover:bg-white/5'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <p className="font-medium text-sm">{session.location}</p>
                                <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                                    {session.ascents.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Calendar size={11} className="text-gray-500" />
                                <p className="text-xs text-gray-400">{formatShortDate(session.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const sessionDetail = selectedSession ? (
        <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                    <button
                        onClick={() => setMobileView('list')}
                        className="md:hidden flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-3 transition"
                    >
                        <ArrowLeft size={14} />
                        All Sessions
                    </button>
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={16} className="text-gray-400" />
                        <h2 className="text-xl font-medium">{selectedSession.location}</h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-500" />
                        <p className="text-sm text-gray-400">{formatDate(selectedSession.createdAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditSessionOpen(true)}
                        className="flex items-center gap-1.5 border border-dino-border px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
                    >
                        <Pencil size={14} />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                        onClick={() => setDeleteSessionOpen(true)}
                        className="flex items-center gap-1.5 border border-red-500/20 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                        onClick={() => setAddAscentOpen(true)}
                        className="flex items-center gap-2 border border-dino-border px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition"
                    >
                        <Plus size={15} />
                        <span className="hidden sm:inline">Add Ascent</span>
                    </button>
                </div>
            </div>

            {selectedSession.notes && (
                <p className="text-sm text-gray-300 bg-white/5 rounded-xl px-4 py-3">
                    {selectedSession.notes}
                </p>
            )}

            <div>
                <h3 className="font-medium mb-3">
                    {selectedSession.ascents.length} {selectedSession.ascents.length === 1 ? 'Ascent' : 'Ascents'}
                </h3>
                <div className="flex flex-col gap-3">
                    {selectedSession.ascents.map(ascent => (
                        <div
                            key={ascent.id}
                            onClick={() => setSelectedAscent(ascent)}
                            className="border border-dino-border rounded-xl px-4 py-3 flex justify-between items-start cursor-pointer hover:bg-white/5 transition"
                        >
                            <div className="flex flex-col gap-1.5">
                                <p className="font-medium text-sm">{ascent.title}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs border border-dino-border px-2 py-0.5 rounded-full">
                                        {ascent.grade}
                                    </span>
                                    <span className={`text-xs border px-2 py-0.5 rounded-full ${getStyleColor(ascent.style)}`}>
                                        {ascent.style}
                                    </span>
                                    {ascent.attempts === 1 && (
                                        <span className="text-xs border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
                                            Flash
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <p className="text-sm text-gray-400">{ascent.height}m</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {ascent.attempts} {ascent.attempts === 1 ? 'attempt' : 'attempts'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <div className="border border-dino-border rounded-2xl flex items-center justify-center min-h-[200px]">
            <p className="text-gray-400 text-sm">No sessions yet. Create one to get started.</p>
        </div>
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-dino-dark text-dino-text">
                <TopNav />
                <main className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-8">

                    <div className="flex justify-between items-start mb-6 md:mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-medium">Logbook</h1>
                            <p className="text-gray-400 mt-1 text-sm">Browse your climbing sessions and ascents</p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={() => setImportOpen(true)}
                                className="flex items-center gap-2 border border-dino-border px-3 md:px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-white/5 transition"
                            >
                                <Upload size={16} />
                                <span className="hidden sm:inline">Import</span>
                            </button>
                            <button
                                onClick={() => setNewSessionOpen(true)}
                                className="flex items-center gap-2 bg-white text-black px-3 md:px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">New Session</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="text-gray-400 text-sm">Loading...</p>
                    ) : (
                        <>
                            {/* Mobile: single column with view switching */}
                            <div className="md:hidden">
                                {mobileView === 'list' ? sessionList : sessionDetail}
                            </div>

                            {/* Desktop: two column layout */}
                            <div className="hidden md:grid grid-cols-[320px_1fr] gap-6">
                                {sessionList}
                                {sessionDetail}
                            </div>
                        </>
                    )}
                </main>
            </div>

            <NewSessionModal
                isOpen={newSessionOpen}
                onClose={() => setNewSessionOpen(false)}
                onSuccess={(session) => {
                    setSelectedSessionId(session.id);
                    setMobileView('detail');
                }}
            />

            <NewSessionModal
                isOpen={editSessionOpen}
                onClose={() => setEditSessionOpen(false)}
                onSuccess={() => setEditSessionOpen(false)}
                session={selectedSession ?? undefined}
            />

            <ImportModal
                isOpen={importOpen}
                onClose={() => setImportOpen(false)}
            />

            <ConfirmModal
                isOpen={deleteSessionOpen}
                onClose={() => setDeleteSessionOpen(false)}
                onConfirm={() => deleteSessionMutation.mutate()}
                title="Delete Session"
                message="This will permanently delete the session and all its ascents. This action cannot be undone."
                confirmLabel="Delete Session"
                isPending={deleteSessionMutation.isPending}
            />

            <AscentDetailModal
                ascent={selectedAscent}
                isOpen={selectedAscent !== null}
                onClose={() => setSelectedAscent(null)}
            />

            {selectedSession && (
                <AddAscentModal
                    isOpen={addAscentOpen}
                    onClose={() => setAddAscentOpen(false)}
                    sessionId={selectedSession.id}
                />
            )}

        </ProtectedRoute>
    );
}