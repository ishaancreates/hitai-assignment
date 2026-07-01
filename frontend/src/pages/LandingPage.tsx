import VideoForm from '../components/VideoForm'
import { motion } from 'framer-motion'
import Ferrofluid from "../components/Ferrofluid";

const LandingPage = () => {
    return (
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 z-[-2] min-h-screen min-w-full bg-neutral-950 flex flex-col items-center justify-center p-4 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-150 pointer-events-none">
          <Ferrofluid
            colors={["#226c79", "#42628e", "#4453b3"]}
            speed={0.5}
            scale={1.6}
            turbulence={1}
            fluidity={0.2}
            rimWidth={0.2}
            sharpness={2.4}
            shimmer={1.5}
            glow={2}
            flowDirection="down"
            opacity={1}
            mouseInteraction
            mouseStrength={1}
            mouseRadius={0.35}
          />
        </div>

        <div className="absolute inset-0  z-[-1] pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-4 tracking-tight z-10 relative">
          Analyse. Every <br /> Round.  Every Action.
        </h1>
        <p className="text-neutral-400 text-lg md:text-lg text-center mb-8 max-w-2xl mt-2">
          Real-time combat video analysis powered by a multi-stage AI pipeline.
        </p>
        <div className="mt-10 w-full">
          <VideoForm />
        </div>
      </motion.div>
    );
}

export default LandingPage