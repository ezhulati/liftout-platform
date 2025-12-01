import { NextResponse } from 'next/server';

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Custom API error class with status code support
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toResponse(): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
      {
        error: this.message,
        code: this.code,
        details: this.details,
      },
      { status: this.statusCode }
    );
  }
}

/**
 * Common API errors
 */
export const ApiErrors = {
  unauthorized: (message = 'Authentication required') =>
    new ApiError(message, 401, 'UNAUTHORIZED'),

  forbidden: (message = 'Access denied') =>
    new ApiError(message, 403, 'FORBIDDEN'),

  notFound: (resource = 'Resource') =>
    new ApiError(`${resource} not found`, 404, 'NOT_FOUND'),

  badRequest: (message: string, details?: Record<string, unknown>) =>
    new ApiError(message, 400, 'BAD_REQUEST', details),

  conflict: (message: string) =>
    new ApiError(message, 409, 'CONFLICT'),

  validationError: (errors: Record<string, string[]>) =>
    new ApiError('Validation failed', 400, 'VALIDATION_ERROR', { errors }),

  rateLimited: (retryAfter?: number) =>
    new ApiError('Too many requests', 429, 'RATE_LIMITED', { retryAfter }),

  internal: (message = 'An unexpected error occurred') =>
    new ApiError(message, 500, 'INTERNAL_ERROR'),
};

/**
 * Handle errors in API routes and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // If it's already an ApiError, return its response
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };

    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        return ApiErrors.conflict(
          `A record with this ${prismaError.meta?.target?.join(', ') || 'value'} already exists`
        ).toResponse();
      case 'P2025': // Record not found
        return ApiErrors.notFound().toResponse();
      case 'P2003': // Foreign key constraint
        return ApiErrors.badRequest('Related record not found').toResponse();
    }
  }

  // Log unexpected errors
  console.error('Unexpected API error:', error);

  // Return generic error for unknown errors
  return ApiErrors.internal().toResponse();
}

/**
 * Type guard to check if a value is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Client-side error handling for fetch requests
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData: ApiErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'An unexpected error occurred' };
    }

    throw new ApiError(
      errorData.error,
      response.status,
      errorData.code,
      errorData.details
    );
  }

  return response.json();
}

/**
 * Get user-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
