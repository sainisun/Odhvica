import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeadlessApiClient } from './client';

describe('HeadlessApiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully parses json response on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [{ id: '1', title: 'Kantha Jacket' }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new HeadlessApiClient('https://api.odhvica.com');
    const result = await client.fetchJson<any[]>('/api/v1/catalogue');

    expect(result).toEqual([{ id: '1', title: 'Kantha Jacket' }]);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.odhvica.com/api/v1/catalogue',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('throws structured error when API returns failure envelope', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ success: false, error: { code: 'INVALID_REQUEST', message: 'Bad params' } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new HeadlessApiClient('https://api.odhvica.com');
    await expect(client.fetchJson('/api/v1/catalogue')).rejects.toThrow(
      '[Odhvica API] INVALID_REQUEST: Bad params'
    );
  });
});
