import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CreateBuyRequestDialog from '@/components/CreateBuyRequestDialog';
import BuyRequestCard from '@/components/BuyRequestCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BuyRequest {
  id: string;
  title: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  reference_image: string | null;
  zone: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: buyRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['buy-requests', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('buy_requests')
        .select(`
          *,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del mercado */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mercado LoCompro
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Los compradores publican qué buscan, los vendedores envían ofertas
          </p>
          {/* Ajuste del botón para igualar el tamaño al input */}
          <Button 
            className="flex items-center gap-2 h-12 px-6 text-lg font-medium"
          >
            <Plus className="h-5 w-5" />
            Crear publicación
          </Button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} placeholder="Buscar solicitudes de compra..." />
            </div>
            
            {/* Botones de filtro y vista */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Categorías rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Categorías más buscadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electrónicos', icon: '📱', count: buyRequests.filter(r => r.title.toLowerCase().includes('electrón') || r.title.toLowerCase().includes('celular') || r.title.toLowerCase().includes('tv')).length },
              { name: 'Ropa', icon: '👕', count: buyRequests.filter(r => r.title.toLowerCase().includes('ropa') || r.title.toLowerCase().includes('vestido') || r.title.toLowerCase().includes('camisa')).length },
              { name: 'Hogar', icon: '🏠', count: buyRequests.filter(r => r.title.toLowerCase().includes('hogar') || r.title.toLowerCase().includes('mueble') || r.title.toLowerCase().includes('cocina')).length },
              { name: 'Deportes', icon: '⚽', count: buyRequests.filter(r => r.title.toLowerCase().includes('deporte') || r.title.toLowerCase().includes('fútbol') || r.title.toLowerCase().includes('gimnasio')).length },
              { name: 'Libros', icon: '📚', count: buyRequests.filter(r => r.title.toLowerCase().includes('libro') || r.title.toLowerCase().includes('novela')).length },
              { name: 'Juguetes', icon: '🧸', count: buyRequests.filter(r => r.title.toLowerCase().includes('juguete') || r.title.toLowerCase().includes('niño')).length }
            ].map((category) => (
              <div
                key={category.name}
                className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} solicitudes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitudes de compra */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Todas las solicitudes de compra'}
            </h2>
            <span className="text-muted-foreground text-sm">
              {buyRequests.length} {buyRequests.length === 1 ? 'solicitud' : 'solicitudes'}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">Cargando solicitudes...</p>
            </div>
          ) : buyRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyRequests.map((request) => (
                <BuyRequestCard key={request.id} buyRequest={request} showOfferButton={true} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery ? 'No se encontraron solicitudes' : '¡Sé el primero en buscar algo!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No encontramos solicitudes que coincidan con "${searchQuery}". Intenta con otros términos.`
                    : 'Aún no hay solicitudes de compra. ¡Crea la primera!'
                  }
                </p>
                {!searchQuery && <CreateBuyRequestDialog onRequestCreated={refetch} />}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Market;
