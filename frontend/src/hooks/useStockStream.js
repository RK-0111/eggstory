import { useEffect } from 'react';

/**
 * Subscribes the storefront to the backend's pub-sub stream (SSE).
 * Whenever the owner changes stock in the admin app — or a customer's
 * payment reduces it — every open browser tab gets the new numbers
 * instantly, no refresh needed.
 */
export function useStockStream(onStockChange) {
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || '/api';
    const source = new EventSource(`${base}/events`);

    source.addEventListener('stock', (e) => {
      try {
        onStockChange(JSON.parse(e.data));
      } catch { /* ignore malformed events */ }
    });

    return () => source.close();
  }, [onStockChange]);
}
