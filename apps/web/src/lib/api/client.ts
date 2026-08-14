import { ApiErrorResponseSchema } from './contracts';

export class HeadlessApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.odhvica.com';
  }

  public async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include', // Crucial for cross-origin cookie sessions
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.success === false) {
      const parsedError = ApiErrorResponseSchema.safeParse(json);
      const message = parsedError.success ? parsedError.data.error.message : `API error status ${res.status}`;
      const code = parsedError.success ? parsedError.data.error.code : 'UNKNOWN_API_ERROR';
      throw new Error(`[Odhvica API] ${code}: ${message}`);
    }

    return (json.data !== undefined ? json.data : json) as T;
  }
}

export const apiClient = new HeadlessApiClient();
