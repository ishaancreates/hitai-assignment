import React from 'react';
import { motion } from 'framer-motion';

export interface Step {
    id: number;
    stage: string;
    name: string;
}

interface AnalysisStepperProps {
    steps: Step[];
    currentStep: number;
}

export const AnalysisStepper: React.FC<AnalysisStepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full mt-12 mb-8">
            <div className="flex items-start justify-between relative">
                {/* Background Line */}
                <div className="absolute top-[11px] left-[10%] w-[80%] h-[1px] bg-neutral-900 z-0"></div>

                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                        {/* Connecting Line Progress */}
                        {index !== steps.length - 1 && (
                            <div className="absolute top-[11px] left-[50%] w-full h-[1px]">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: '0%' }}
                                    animate={{ width: step.id < currentStep ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}

                        {/* Step Dot */}
                        <motion.div
                            className={`w-6 h-6 flex justify-center items-center rounded-full text-[10px] font-bold transition-all duration-500 z-10 ${step.id < currentStep ? 'bg-emerald-500 text-neutral-950' :
                                    step.id === currentStep ? 'bg-emerald-500 text-neutral-950 scale-125' :
                                        'bg-neutral-900 text-neutral-500'
                                }`}
                        >
                            {step.id < currentStep ? (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                step.id
                            )}
                        </motion.div>

                        {/* Step Label */}
                        <div className={`mt-3 text-[10px] md:text-xs text-center md:whitespace-nowrap uppercase tracking-wider transition-colors duration-300 ${step.id <= currentStep ? 'text-neutral-300 font-semibold' : 'text-neutral-600'
                            }`}>
                            {step.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
