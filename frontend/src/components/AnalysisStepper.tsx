import React from "react";
import { motion, type Variants } from "motion/react";

export interface Step {
  id: number;
  stage: string;
  name: string;
}

interface AnalysisStepperProps {
  steps: Step[];
  currentStep: number;
}

export const AnalysisStepper: React.FC<AnalysisStepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex w-full items-center mt-12 mb-8">
      {steps.map((step, index) => {
        const isNotLastStep = index < steps.length - 1;
        return (
          <React.Fragment key={step.id}>
            <StepIndicator step={step} currentStep={currentStep} />
            {isNotLastStep && (
              <StepConnector isComplete={currentStep > step.id} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

interface StepIndicatorProps {
  step: Step;
  currentStep: number;
}

function StepIndicator({ step, currentStep }: StepIndicatorProps) {
  const status =
    currentStep === step.id
      ? "active"
      : currentStep < step.id
        ? "inactive"
        : "complete";

  return (
    <div className="flex flex-col items-center flex-1">
      <motion.div
        className="relative outline-none focus:outline-none"
        animate={status}
        initial={false}
      >
        <motion.div
          variants={{
            inactive: { scale: 1, backgroundColor: "#222", color: "#a3a3a3" },
            active: { scale: 1, backgroundColor: "#5227FF", color: "#5227FF" },
            complete: {
              scale: 1,
              backgroundColor: "#5227FF",
              color: "#3b82f6",
            },
          }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
        >
          {status === "complete" ? (
            <CheckIcon className="h-4 w-4 text-black" />
          ) : status === "active" ? (
            <div className="h-3 w-3 rounded-full bg-[#120F17]" />
          ) : (
            <span className="text-sm">{step.id}</span>
          )}
        </motion.div>
      </motion.div>

      <div
        className={`mt-3 text-[10px] md:text-xs text-center md:whitespace-nowrap uppercase tracking-wider transition-colors duration-300 ${
          status !== "inactive"
            ? "text-neutral-300 font-semibold"
            : "text-neutral-600"
        }`}
      >
        {step.name}
      </div>
    </div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#5227FF" },
  };

  return (
    <div className="relative -mt-5.5 mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
type CheckIconProps = React.SVGProps<SVGSVGElement>;

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
