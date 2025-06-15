import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_image: string | null;
  zone: string;
  created_at: string;
  categories: {
    name: string;
  } | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface SearchBuyRequestsProps {
  searchQuery?: string;
}

const SearchBuyRequests: React.FC<SearchBuyRequestsProps> = ({ searchQuery = '' }) => {
  // Remove separate state for search and filters, use prop instead

  // Fetch categories just for category names on cards
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: buyRequests, isLoading } = useQuery({
    queryKey: ['buy-requests', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('buy_requests')
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (searchQuery && searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BuyRequest[];
    }
  });

  const formatPrice = (min: number | null, max: number | null) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
    if (min) return `Desde ${format(min)}`;
    if (max) return `Hasta ${format(max)}`;
    return 'Presupuesto abierto';
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
      {/* Results */}
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
