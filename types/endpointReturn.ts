export interface EndpointReturn<T = any> {
    statusCode: number;
    data?: T;
    error?: string;
}
