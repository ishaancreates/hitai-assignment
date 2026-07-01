import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAnalysisStream } from '../hooks/useAnalysisStream'
import { AnalysisStepper, type Step } from '../components/AnalysisStepper'
import { AnalysisLogs } from '../components/AnalysisLogs'
import { AnalysisStatus } from '../components/AnalysisStatus'

const steps: Step[] = [
    { id: 1, stage: 'queued', name: 'Queued' },
    { id: 2, stage: 'downloading_video', name: 'Downloading Video' },
    { id: 3, stage: 'extracting_frames', name: 'Extracting Frames' },
    { id: 4, stage: 'detecting_actions', name: 'Detecting Actions' },
    { id: 5, stage: 'segmenting_rounds', name: 'Segmenting Rounds' },
    { id: 6, stage: 'generating_insights', name: 'Generating Insights' },
    { id: 7, stage: 'completed', name: 'Completed' }
]

const AnalysisPage = () => {
    const { id } = useParams<{ id: string }>()

    const {
        currentStep,
        progress,
        message,
        logs,
        rawLogs,
        connectionStatus
    } = useAnalysisStream(id, steps);

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-screen w-full fixed top-0 left-0 bg-neutral-950 text-white pt-20 pb-8 px-6 flex flex-col items-center overflow-hidden"
        >
            <div className="w-full max-w-5xl flex flex-col gap-8 h-full min-h-0">
                <div className="shrink-0 flex flex-col gap-8">
                    <AnalysisStatus
                        id={id || 'unknown'}
                        connectionStatus={connectionStatus}
                        message={message}
                        progress={progress}
                    />

                    {/* Stepper component */}
                    <div className="w-full">
                        <AnalysisStepper steps={steps} currentStep={currentStep} />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row gap-8 flex-1 min-h-0">
                    <div className="flex-1 min-h-0">
                        <AnalysisLogs logs={logs} />
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col">
                        <div className="w-full h-full flex flex-col items-start overflow-hidden">
                            <div className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-4 shrink-0">Raw SSE Responses</div>
                            <div className="w-full flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-2 flex flex-col text-left [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                                {[...rawLogs].map((log) => (
                                    <div key={log.id} className="text-emerald-500/80 bg-emerald-500/5 p-2 rounded break-all whitespace-pre-wrap shrink-0">
                                        <span className="text-neutral-700 mr-2">[{log.time}]</span>
                                        {log.data}
                                    </div>
                                ))}
                                {rawLogs.length === 0 && <span className="text-neutral-700 shrink-0">Awaiting events...</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default AnalysisPage