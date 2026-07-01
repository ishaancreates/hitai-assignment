import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAnalysisStream } from '../hooks/useAnalysisStream'
import { AnalysisStepper, type Step } from '../components/AnalysisStepper'
import { AnalysisStatus } from '../components/AnalysisStatus'
import Ferrofluid from '../components/Ferrofluid'

const steps: Step[] = [
  { id: 1, stage: 'queued', name: 'Queued' },
  { id: 2, stage: 'downloading_video', name: 'Downloading Video' },
  { id: 3, stage: 'extracting_frames', name: 'Extracting Frames' },
  { id: 4, stage: 'detecting_actions', name: 'Detecting Actions' },
  { id: 5, stage: 'segmenting_rounds', name: 'Segmenting Rounds' },
  { id: 6, stage: 'generating_insights', name: 'Generating Insights' },

]

const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastAnalysisId', id);
    }
  }, [id]);

  const {
    currentStep,
    progress,
    message,

    rawLogs,
    connectionStatus
  } = useAnalysisStream(id, steps);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen w-full fixed top-0 left-0 bg-neutral-950 text-white pt-20 pb-8 px-6 flex flex-col items-center overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Ferrofluid
          colors={["#226c79", "#42628e", "#4453b3"]}
          speed={0.5}
          scale={1.6}
          turbulence={0.8}
          fluidity={0.2}
          rimWidth={0.2}
          sharpness={2.4}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={0.8}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
        />
      </div>
      <div className="w-full max-w-5xl flex flex-col gap-8 h-full min-h-0">
        <div className="shrink-0 flex flex-col gap-8">
          <AnalysisStatus
            id={id || "unknown"}
            connectionStatus={connectionStatus}
            message={message}
            progress={progress}
          />


          <div className="w-full">
            <AnalysisStepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-8 flex-1 min-h-0">
          {/* <div className="flex-1 min-h-0">
              <AnalysisLogs logs={logs} />
            </div> */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="w-full h-full flex flex-col items-start overflow-hidden">
              <div className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-4 shrink-0">
                Last 10 LOGS
              </div>
              <div className="w-full flex-1 min-h-0 overflow-y-auto font-mono text-xs space-y-2 flex flex-col text-left [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {[...rawLogs].map((log) => (
                  <div
                    key={log.id}
                    className=" bg-neutral-950  bg-neutral-950 p-2 rounded break-all whitespace-pre-wrap shrink-0"
                  >

                    [{JSON.stringify(JSON.parse(log.data), null, 2)}]


                  </div>
                ))}
                {rawLogs.length === 0 && (
                  <span className="text-neutral-700 shrink-0">
                    Awaiting events...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalysisPage