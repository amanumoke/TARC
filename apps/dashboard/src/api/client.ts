import type { ApiResponse } from '@tarcms/shared';

const BASE_URL = '/api/v1';

interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.pathname + url.search;
}

function getToken(): string | null {
  return localStorage.getItem('tarcms_token');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(endpoint, params);
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('tarcms_token');
    localStorage.removeItem('tarcms_user');
    window.location.href = '/login';
    throw new ApiError('Unauthorized', 401);
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.error?.message || `Request failed: ${response.status}`,
      response.status,
      json.error
    );
  }

  if (json.meta) {
    return { data: json.data, meta: json.meta } as T;
  }
  return (json.data ?? undefined) as T;
}

export function get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET', ...options });
}

export function post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

export function del<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE', ...options });
}
