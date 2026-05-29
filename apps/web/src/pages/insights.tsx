import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNav from '../components/TopNav';
import GradePyramidChart from '../components/insights/GradePyramidChart';
import AttemptRatioChart from '../components/insights/AttemptRatioChart';
import VolumeChart from '../components/insights/VolumeChart';
import { useGradePyramid, useAttemptRatio, useVolume } from '../lib/queries';

type Tab = 'Grade Pyramid' | 'Attempt Ratio' | 'Volume';
const TABS: Tab[] = ['Grade Pyramid', 'Attempt Ratio', 'Volume'];

export default function Insights() {
    const [activeTab, setActiveTab] = useState<Tab>('Grade Pyramid');

    const { data: pyramidData, isLoading: pyramidLoading } = useGradePyramid();
    const { data: ratioData, isLoading: ratioLoading } = useAttemptRatio();
    const { data: volumeData, isLoading: volumeLoading } = useVolume();

    const isLoading = pyramidLoading || ratioLoading || volumeLoading;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-dino-dark text-dino-text">
                <TopNav />
                <main className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-8 flex flex-col gap-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-medium">Insights</h1>
                        <p className="text-gray-400 mt-1 text-sm">Analyze your climbing performance with detailed visualizations</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                                    activeTab === tab
                                        ? 'border-white/30 text-white bg-white/10'
                                        : 'border-dino-border text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <p className="text-gray-400 text-sm">Loading insights...</p>
                    ) : (
                        <>
                            {activeTab === 'Grade Pyramid' && pyramidData && pyramidData.length > 0 && (
                                <GradePyramidChart data={pyramidData} />
                            )}
                            {activeTab === 'Attempt Ratio' && ratioData && ratioData.length > 0 && (
                                <AttemptRatioChart data={ratioData} />
                            )}
                            {activeTab === 'Volume' && volumeData && volumeData.data.length > 0 && (
                                <VolumeChart data={volumeData} />
                            )}
                            {((activeTab === 'Grade Pyramid' && (!pyramidData || pyramidData.length === 0)) ||
                              (activeTab === 'Attempt Ratio' && (!ratioData || ratioData.length === 0)) ||
                              (activeTab === 'Volume' && (!volumeData || volumeData.data.length === 0))) && (
                                <div className="border border-dino-border rounded-2xl p-12 flex items-center justify-center">
                                    <p className="text-gray-400 text-sm">No data yet. Log some ascents to see insights.</p>
                                </div>
                            )}
                        </>
                    )}

                </main>
            </div>
        </ProtectedRoute>
    );
}