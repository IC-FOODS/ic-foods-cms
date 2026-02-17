import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCmsPage, stripHtml, richTextHtml } from './useCmsPage';

describe('useCmsPage', () => {
  it('fetches page by slug and returns data', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        items: [{ id: 42, title: 'About', meta: { slug: 'about' } }],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useCmsPage('about'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.page?.id).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('serves repeated slug requests from cache', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        items: [{ id: 77, title: 'Cached', meta: { slug: 'cached' } }],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const first = renderHook(() => useCmsPage('cached'));
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();

    const second = renderHook(() => useCmsPage('cached'));
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(second.result.current.page?.id).toBe(77);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('cms helper utilities', () => {
  it('strips html and preserves plain text', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('returns dangerouslySetInnerHTML shape', () => {
    expect(richTextHtml('<p>x</p>')).toEqual({ __html: '<p>x</p>' });
  });
});
