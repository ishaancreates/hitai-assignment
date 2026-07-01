import { useState, useEffect } from 'react';
import type { SSEEventData } from '../types/api';

export const useAnalysisStream = (id: string | undefined, steps: { id: number, stage: string }[]) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Waiting for stream...");
    const [logs, setLogs] = useState<{ id: string, text: string, time: string }[]>([]);
    const [rawLogs, setRawLogs] = useState<{ id: string, data: string, time: string }[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'failed'>('connecting');

    useEffect(() => {
        if (!id) return;

        let eventSource: EventSource | null = null;
        let retryCount = 0;
        let timeoutId: ReturnType<typeof setTimeout>;
        let isSetupActive = true;

        const connect = async () => {
            setConnectionStatus(retryCount === 0 ? 'connecting' : 'reconnecting');
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

            if (retryCount === 0) {
                try {
                    const response = await fetch(`${API_BASE_URL}/analyses/${id}`);
                    if (response.status === 404) {
                        if (!isSetupActive) return;
                        setConnectionStatus('failed');
                        setMessage("Analysis not found.");
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (err) {
                    // Ignore pre-flight network errors and let EventSource handle standard retries
                }
            }

            if (!isSetupActive) return;

            eventSource = new EventSource(`${API_BASE_URL}/analyses/${id}/stream`);

            eventSource.onopen = () => {
                setConnectionStatus('connected');
                retryCount = 0;
            };

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as SSEEventData;

                    const matchedStep = steps.find(s => s.stage === data.stage);
                    if (matchedStep) {
                        setCurrentStep(matchedStep.id);
                    }

                    setProgress(data.progress);
                    setMessage(data.message);

                    setLogs(prev => {
                        const newLog = {
                            id: Math.random().toString(),
                            text: data.message,
                            time: new Date().toLocaleTimeString([], { hour12: false })
                        };
                        const newLogs = [...prev, newLog];
                        return newLogs.length > 10 ? newLogs.slice(newLogs.length - 10) : newLogs;
                    });

                    setRawLogs(prev => {
                        const newLog = {
                            id: Math.random().toString(),
                            data: event.data,
                            time: new Date().toLocaleTimeString([], { hour12: false })
                        };
                        const newLogs = [...prev, newLog];
                        return newLogs.length > 15 ? newLogs.slice(newLogs.length - 15) : newLogs;
                    });

                    if (data.stage === 'completed' || data.stage === 'failed') {
                        eventSource?.close();
                        setConnectionStatus('connected');
                    }
                } catch (err) {
                    console.error("Failed to parse event data", err);
                }
            };

            eventSource.onerror = () => {
                eventSource?.close();

                if (retryCount >= 5) {
                    setConnectionStatus('failed');
                    setMessage('Connection lost. Please try again.');
                    return;
                }

                setConnectionStatus('reconnecting');
                const delay = Math.min(1000 * (2 ** retryCount), 10000);
                retryCount++;
                timeoutId = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            isSetupActive = false;
            if (eventSource) eventSource.close();
            clearTimeout(timeoutId);
        };
    }, [id, steps]);

    return {
        currentStep,
        progress,
        message,
        logs,
        rawLogs,
        connectionStatus
    };
};