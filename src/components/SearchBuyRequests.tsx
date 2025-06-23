
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
          profiles!inner (
            full_name
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
      console.log('Profile data sample:', data?.[0]?.profiles);
      
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
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Remove from cache immediately when unused
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
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

  const formatPrice = (min: number, max: number) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (min === max) return format(min);
    return `${format(min)} - ${format(max)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando publicaciones</p>
        </div>
      ) : !buyRequests || buyRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron publicaciones</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {buyRequests.length} {buyRequests.length === 1 ? 'publicación' : 'publicaciones'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {request.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-bold">
                      {formatPrice(request.min_price, request.max_price)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(request.created_at)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  {request.reference_image && (
                    <img
                      src={request.reference_image}
                      alt="Referencia"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {request.zone}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      Por: {request.profiles?.full_name || 'Usuario anónimo'}
                    </p>
                    <Button asChild size="sm">
                      <Link to={`/buy-request/${request.id}`} className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBuyRequests;
