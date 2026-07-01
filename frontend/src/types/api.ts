export interface AnalysisResponse {
    analysis_id: string;
    status: string;
}

export interface SSEEventData {
    stage: string;
    progress: number;
    message: string;
}
