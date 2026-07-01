export interface AnalysisResponse {
    analysis_id: string;
    status: string;
}

export interface SSEEventLog {
    analysis_id: string;
    stage: string;
    progress: number;
    message: string;
    timestamp: string;
}

export interface SSEEventData {
    stage: string;
    progress: number;
    message: string;
    status?: string;
    logs?: SSEEventLog[];
}

