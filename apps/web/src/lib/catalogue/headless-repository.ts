import { apiClient } from '@/lib/api/client';
import { CatalogueQueryInput } from '@/lib/api/contracts';

export async function fetchHeadlessCatalogue(query?: CatalogueQueryInput) {
  try {
    const params = new URLSearchParams();
    if (query?.category) params.set('category', query.category);
    if (query?.collection) params.set('collection', query.collection);
    if (query?.search) params.set('search', query.search);
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.offset) params.set('offset', String(query.offset));

    const queryString = params.toString();
    const endpoint = `/api/v1/catalogue${queryString ? `?${queryString}` : ''}`;
    
    return await apiClient.fetchJson<any[]>(endpoint);
  } catch (err) {
    // Fallback to empty list or local mock if Railway API is unprovisioned during offline dev/preview
    console.warn('[Headless Client] Falling back to local catalog due to API connection error:', err);
    return [];
  }
}
