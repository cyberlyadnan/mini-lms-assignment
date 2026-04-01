export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: {
    data: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    previousPage: boolean;
    nextPage: boolean;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
