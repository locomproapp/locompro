
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Eye } from 'lucide-react';
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

const SearchBuyRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    queryKey: ['buy-requests', searchQuery, selectedCategory],
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

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BuyRequest[];
    }
  });

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Presupuesto abierto';
    if (min && max && min !== max) return `$${min} - $${max}`;
    if (min) return `Desde $${min}`;
    if (max) return `Hasta $${max}`;
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
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Buscar solicitudes de compra</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando solicitudes...</p>
          </div>
        ) : !buyRequests || buyRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron solicitudes de compra</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {buyRequests.length} solicitud{buyRequests.length !== 1 ? 'es' : ''} encontrada{buyRequests.length !== 1 ? 's' : ''}
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
                      {request.categories && (
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          {request.categories.name}
                        </Badge>
                      )}
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

                  <CardContent className="space-y-3">
                    {request.reference_image && (
                      <img
                        src={request.reference_image}
                        alt="Referencia"
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    
                    {request.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
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
    </div>
  );
};

export default SearchBuyRequests;
