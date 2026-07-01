import React from 'react';

interface Log {
    id: string;
    text: string;
    time: string;
}

interface AnalysisLogsProps {
    logs: Log[];
}

export const AnalysisLogs: React.FC<AnalysisLogsProps> = ({ logs }) => {
    return (
        <div className="w-full h-full flex flex-col items-start overflow-hidden">
            <div className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-4 shrink-0">Execution Logs</div>
            <div className="w-full flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-1.5 flex flex-col text-left [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[...logs].map(log => (
                    <div key={log.id} className="text-neutral-300 shrink-0">
                        <span className="text-neutral-700 mr-4">[{log.time}]</span>
                        {log.text}
                    </div>
                ))}
                {logs.length === 0 && <span className="text-neutral-700 shrink-0">Awaiting incoming telemetry...</span>}
            </div>
        </div>
    );
};
