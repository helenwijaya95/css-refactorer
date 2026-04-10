export interface RefactorResult {
    tailwindClasses: string;
    explanation: string;
}

export interface ActionResponse {
    success: boolean;
    data?: RefactorResult;
    error?: string;
}