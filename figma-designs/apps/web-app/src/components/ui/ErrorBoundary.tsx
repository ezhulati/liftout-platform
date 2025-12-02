'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-bg-tertiary rounded-lg text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-error break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs font-mono text-text-tertiary mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-navy text-white font-medium text-sm hover:bg-navy-600 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/app/dashboard'}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-text-primary font-medium text-sm hover:bg-bg-secondary transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
interface UseErrorBoundaryReturn {
  error: Error | null;
  resetError: () => void;
  ErrorFallback: React.FC<{ error: Error }>;
}

export function useErrorBoundary(): UseErrorBoundaryReturn {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const ErrorFallback: React.FC<{ error: Error }> = ({ error: fallbackError }) => (
    <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-error">Error</h3>
          <p className="text-sm text-text-secondary mt-1">{fallbackError.message}</p>
          <button
            onClick={resetError}
            className="mt-2 text-sm font-medium text-navy hover:text-navy-600"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );

  return { error, resetError, ErrorFallback };
}

// Page-level error boundary with more detailed UI
export function PageErrorBoundary({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-6">
          <div className="max-w-lg w-full">
            <div className="card p-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6">
                <ExclamationTriangleIcon className="w-10 h-10 text-error" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-3">
                Page Error
              </h1>
              <p className="text-text-secondary mb-8">
                We encountered an error while loading this page. This has been logged and our team will look into it.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-navy text-white font-medium hover:bg-navy-600 transition-colors"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Reload Page
                </button>
                <button
                  onClick={() => window.location.href = '/app/dashboard'}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-text-primary font-medium hover:bg-bg-secondary transition-colors"
                >
                  Return to Dashboard
                </button>
                <a
                  href="mailto:support@liftout.com"
                  className="text-sm text-text-tertiary hover:text-navy transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
