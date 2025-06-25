

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

  const { data: buyRequests, isLoading, refetch } = useQuery({
    queryKey: ['buy-requests', searchQuery],
    queryFn: async () => {
      console.log('🔄 Fetching buy requests with complete profile data...');
      
      // First, let's test if we can access profiles table directly
      console.log('🧪 Testing direct profiles table access...');
      const { data: profilesTest, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      console.log('🧪 Direct profiles access result:', { 
        success: !profilesError, 
        error: profilesError, 
        count: profilesTest?.length || 0,
        sample_data: profilesTest?.[0] || 'none'
      });

      // Try different join approaches to diagnose the issue
      console.log('🧪 Testing different join strategies...');
      
      // Strategy 1: Current approach (nested select)
      let query1 = supabase
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
        query1 = query1.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: result1, error: error1 } = await query1;
      console.log('🧪 Strategy 1 (nested select) result:', { 
        success: !error1, 
        error: error1, 
        count: result1?.length || 0,
        first_item_profiles: result1?.[0]?.profiles || 'null'
      });

      // Strategy 2: Try explicit join syntax
      const { data: result2, error: error2 } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('status', 'active')
        .limit(3);

      console.log('🧪 Strategy 2 (inner join) result:', { 
        success: !error2, 
        error: error2, 
        count: result2?.length || 0,
        first_item_profiles: result2?.[0]?.profiles || 'null'
      });

      // Strategy 3: Try left join
      const { data: result3, error: error3 } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles(*)
        `)
        .eq('status', 'active')
        .limit(3);

      console.log('🧪 Strategy 3 (left join) result:', { 
        success: !error3, 
        error: error3, 
        count: result3?.length || 0,
        first_item_profiles: result3?.[0]?.profiles || 'null'
      });

      // Use the original query but with more error handling
      const { data, error } = await query1;
      
      if (error) {
        console.error('❌ Error fetching buy requests:', error);
        throw error;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} buy requests from database`);
      
      // Enhanced logging for profile data debugging with raw database response
      data?.forEach((request, index) => {
        console.log(`🔍 Request ${index + 1} [${request.id}] - RAW DATABASE RESPONSE:`, {
          title: request.title,
          user_id: request.user_id,
          has_profiles: !!request.profiles,
          profiles_is_array: Array.isArray(request.profiles),
          raw_profiles_data: request.profiles,
          profiles_structure: request.profiles ? JSON.stringify(request.profiles, null, 2) : 'null',
          full_name_from_db: request.profiles?.full_name,
          email_from_db: request.profiles?.email,
          full_name_type: typeof request.profiles?.full_name,
          email_type: typeof request.profiles?.email,
          all_profile_keys: request.profiles ? Object.keys(request.profiles) : 'null'
        });
      });
      
      return (data || []).map(request => ({
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

