import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisStatusProps {
    id: string;
    connectionStatus: 'connecting' | 'connected' | 'reconnecting' | 'failed';
    message: string;
    progress: number;
}

export const AnalysisStatus: React.FC<AnalysisStatusProps> = ({ id, connectionStatus, message, progress }) => {
    return (
        <div className="w-full flex flex-col items-start text-left">
            <div className="flex flex-row items-center gap-4 mb-2">
                <h1 className="text-6xl font-bold tracking-tight">Analysis</h1>
                <span className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2 ${connectionStatus === 'connected' ? 'bg-blue-500/10 text-blue-500' :
                    connectionStatus === 'reconnecting' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                        connectionStatus === 'failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-blue-500/10 text-blue-500 animate-pulse'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-blue-500' :
                        connectionStatus === 'reconnecting' ? 'bg-amber-500' :
                            connectionStatus === 'failed' ? 'bg-red-500' :
                                'bg-blue-500'
                        }`}></div>
                    {connectionStatus === 'reconnecting' ? 'RECONNECTING...' : connectionStatus}
                </span>
            </div>

            <p className="text-neutral-500 font-mono text-sm">ID: {id}</p>

            <div className="mt-8 flex flex-col items-start gap-3 w-full">
                <div className="flex justify-between w-full items-end">
                    <p className="text-neutral-300 font-medium text-lg">{message}</p>
                    <span className="text-neutral-500 font-mono text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-900 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
};
