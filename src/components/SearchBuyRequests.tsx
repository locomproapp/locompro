
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import LoadingState from './SearchBuyRequests/LoadingState';
import EmptyState from './SearchBuyRequests/EmptyState';
import SearchResultsHeader from './SearchBuyRequests/SearchResultsHeader';
import BuyRequestGrid from './SearchBuyRequests/BuyRequestGrid';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  reference_image: string | null;
  zone: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface SearchBuyRequestsProps {
  searchQuery?: string;
}

const SearchBuyRequests: React.FC<SearchBuyRequestsProps> = ({ searchQuery = '' }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: buyRequests, isLoading, refetch } = useQuery({
    queryKey: ['buy-requests', searchQuery],
    queryFn: async () => {
      console.log('🔄 Fetching buy requests from database...');
      let query = supabase
        .from('buy_requests')
        .select(`
          *,
          profiles!buy_requests_user_id_fkey (
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('❌ Error fetching buy requests:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} buy requests from database`);
      
      // Log detailed profile data for debugging
      data?.forEach((request, index) => {
        console.log(`🔍 Request ${index + 1}:`, {
          id: request.id,
          title: request.title,
          user_id: request.user_id,
          profile_data: request.profiles,
          profile_full_name: request.profiles?.full_name
        });
      });
      
      // Log the IDs of fetched requests for debugging
      const requestIds = data?.map(r => r.id) || [];
      console.log('📋 Current request IDs:', requestIds);
      
      return (data || []).map(request => ({
        id: request.id,
        title: request.title,
        description: request.description,
        min_price: request.min_price,
        max_price: request.max_price,
        reference_image: request.reference_image,
        zone: request.zone,
        created_at: request.created_at,
        profiles: request.profiles
      })) as BuyRequest[];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Handle refresh when coming from a deletion
  React.useEffect(() => {
    if (location.state?.refresh || location.state?.deletedRequestId) {
      const deletedId = location.state?.deletedRequestId;
      console.log('🗑️ Deletion detected, forcing complete data refresh...', { deletedId });
      
      // Force a complete cache invalidation and refetch
      queryClient.clear(); // Clear entire cache
      queryClient.invalidateQueries({ queryKey: ['buy-requests'] });
      
      // Force immediate refetch
      refetch().then((result) => {
        if (result.data && deletedId) {
          const stillExists = result.data.some(req => req.id === deletedId);
          if (stillExists) {
            console.error('⚠️ WARNING: Deleted request still appears in results!', deletedId);
            // Force another refetch after a short delay
            setTimeout(() => {
              console.log('🔄 Forcing additional refetch due to stale data...');
              queryClient.clear();
              refetch();
            }, 500);
          } else {
            console.log('✅ Deleted request successfully removed from results');
          }
        }
      });
      
      // Clear the state after handling
      setTimeout(() => {
        if (window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }, 100);
    }
  }, [location.state, queryClient, refetch]);

  // Listen for global events to refresh the data
  React.useEffect(() => {
    const handleBuyRequestDeleted = (event: any) => {
      const deletedId = event.detail?.buyRequestId;
      console.log('🗑️ Buy request deleted event received, forcing complete refresh...', { deletedId });
      
      // Clear entire cache and force refetch
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['buy-requests'] });
      
      // Force refetch and verify deletion
      refetch().then((result) => {
        if (result.data && deletedId) {
          const stillExists = result.data.some(req => req.id === deletedId);
          if (stillExists) {
            console.error('⚠️ WARNING: Deleted request still appears after event!', deletedId);
            // Try one more time with a delay
            setTimeout(() => {
              console.log('🔄 Final refetch attempt...');
              queryClient.clear();
              refetch();
            }, 1000);
          } else {
            console.log('✅ Event-triggered refresh successful - deleted request removed');
          }
        }
      });
    };

    const handleBuyRequestUpdated = () => {
      console.log('📝 Buy request updated event received, refreshing data...');
      queryClient.invalidateQueries({ queryKey: ['buy-requests'] });
      refetch();
    };

    window.addEventListener('buyRequestDeleted', handleBuyRequestDeleted);
    window.addEventListener('buyRequestUpdated', handleBuyRequestUpdated);

    return () => {
      window.removeEventListener('buyRequestDeleted', handleBuyRequestDeleted);
      window.removeEventListener('buyRequestUpdated', handleBuyRequestUpdated);
    };
  }, [queryClient, refetch]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingState />
      ) : !buyRequests || buyRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SearchResultsHeader count={buyRequests.length} />
          <BuyRequestGrid buyRequests={buyRequests} />
        </>
      )}
    </div>
  );
};

export default SearchBuyRequests;
