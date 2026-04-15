export interface RefactorResult {
    tailwindClasses: string;
    explanation: string;
}

export interface GeminiError extends Error {
  status?: number;
  response?: {
    status: number;
  };
}


export type ActionResponse = 
  | { success: true; data: RefactorResult[] }
  | { success: false; error: string };