export interface ApiError {
    statusCode: number;
    message: string;
    success: false;
    // data: object | null;
    data? : object;
    errors?: unknown[]; 
    stack?: string;
}