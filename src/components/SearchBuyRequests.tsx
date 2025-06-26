
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    location: string | null;
    email: string | null;
  } | null;
}

interface SearchBuyRequestsProps {
  searchQuery?: string;
}

const SearchBuyRequests: React.FC<SearchBuyRequestsProps> = ({ searchQuery = '' }) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { user, session, loading: authLoading } = useAuth();

  const { data: buyRequests, isLoading, error, refetch } = useQuery({
    queryKey: ['buy-requests', searchQuery],
    queryFn: async () => {
      console.log('🔄 SearchBuyRequests - Starting fetch with:', {
        searchQuery,
        domain: window.location.hostname,
        hasSession: !!session,
        hasUser: !!user,
        userId: user?.id
      });
      
      try {
        let query = supabase
          .from('buy_requests')
          .select(`
            id,
            title,
            description,
            min_price,
            max_price,
            reference_image,
            zone,
            created_at,
            user_id,
            profiles:user_id (
              full_name,
              avatar_url,
              location,
              email
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (searchQuery && searchQuery.trim()) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        console.log('🔍 SearchBuyRequests - Executing query...');
        const { data, error } = await query;
        
        if (error) {
          console.error('❌ SearchBuyRequests - Query error:', {
            error,
            domain: window.location.hostname,
            hasSession: !!session
          });
          throw error;
        }
        
        console.log(`✅ SearchBuyRequests - Query successful:`, {
          resultCount: data?.length || 0,
          domain: window.location.hostname,
          hasSession: !!session,
          sampleData: data?.slice(0, 1)
        });
        
        const transformedData: BuyRequest[] = (data || []).map(request => ({
          id: request.id,
          title: request.title,
          description: request.description,
          min_price: request.min_price,
          max_price: request.max_price,
          reference_image: request.reference_image,
          zone: request.zone,
          created_at: request.created_at,
          user_id: request.user_id,
          profiles: request.profiles
        }));
        
        console.log('🔄 SearchBuyRequests - Data transformation complete');
        return transformedData;
      } catch (err) {
        console.error('💥 SearchBuyRequests - Fetch failed:', {
          error: err,
          domain: window.location.hostname,
          hasSession: !!session
        });
        throw err;
      }
    },
    enabled: !authLoading, // Don't run query until auth state is determined
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

  console.log('🎯 SearchBuyRequests - Render state:', {
    authLoading,
    isLoading,
    hasError: !!error,
    dataLength: buyRequests?.length || 0,
    searchQuery,
    domain: window.location.hostname,
    hasSession: !!session
  });

  // Show loading if auth is still loading
  if (authLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('❌ SearchBuyRequests - Rendering error state:', {
      error,
      domain: window.location.hostname
    });
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error cargando publicaciones: {error.message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Dominio: {window.location.hostname}
        </p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Reintentar
        </button>
      </div>
    );
  }

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
