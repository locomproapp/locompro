
import { useCallback, useRef } from 'react';

interface UseOfferRefreshProps {
  fetchUserOffers: () => Promise<void>;
}

export const useOfferRefresh = ({ fetchUserOffers }: UseOfferRefreshProps) => {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(0);
  
  const debouncedRefresh = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;
    
    // Prevent refreshes more frequent than 1 second
    if (timeSinceLastRefresh < 1000) {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        lastRefreshRef.current = Date.now();
        fetchUserOffers();
      }, 1000 - timeSinceLastRefresh);
      
      return;
    }
    
    lastRefreshRef.current = now;
    await fetchUserOffers();
  }, [fetchUserOffers]);

  return { debouncedRefresh };
};
