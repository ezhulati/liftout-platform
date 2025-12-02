/**
 * API Helper utilities for the Liftout platform
 * Includes API server availability checking and fallback handling
 */

const API_BASE = process.env.API_SERVER_URL || 'http://localhost:8000';

let apiServerAvailable: boolean | null = null;
let lastCheck: number = 0;
const CHECK_INTERVAL = 30000; // Re-check every 30 seconds

/**
 * Check if the API server is available
 * Caches the result for 30 seconds to avoid excessive health checks
 */
export async function isApiServerAvailable(): Promise<boolean> {
  const now = Date.now();

  // Return cached result if checked recently
  if (apiServerAvailable !== null && (now - lastCheck) < CHECK_INTERVAL) {
    return apiServerAvailable;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    apiServerAvailable = response.ok;
    lastCheck = now;
    return apiServerAvailable;
  } catch (error) {
    apiServerAvailable = false;
    lastCheck = now;
    return false;
  }
}

/**
 * Reset the API server availability cache
 * Useful for forcing a re-check
 */
export function resetApiServerCache(): void {
  apiServerAvailable = null;
  lastCheck = 0;
}

/**
 * Get authorization headers for API server requests
 */
export function getAuthHeaders(session: any): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }

  return headers;
}

/**
 * Proxy a request to the API server with error handling
 */
export async function proxyToApiServer(
  path: string,
  options: RequestInit,
  session: any
): Promise<Response> {
  const headers = getAuthHeaders(session);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  return response;
}

/**
 * Generate a unique ID for mock data
 */
export function generateMockId(prefix: string): string {
  return `${prefix}_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
