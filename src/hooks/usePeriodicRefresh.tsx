
import { useEffect } from 'react';

interface UsePeriodicRefreshProps {
  user: any;
  fetchUserOffers: () => Promise<void>;
  intervalMs?: number;
}

export const usePeriodicRefresh = ({ user, fetchUserOffers, intervalMs = 8000 }: UsePeriodicRefreshProps) => {
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Periodic enhanced refresh of offers');
      fetchUserOffers();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [user, fetchUserOffers, intervalMs]);
};
