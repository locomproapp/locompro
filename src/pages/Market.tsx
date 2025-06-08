
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import CreatePostDialog from '@/components/CreatePostDialog';
import PostCard from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading, refetch } = usePosts(searchQuery);

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
            Descubre miles de productos de vendedores de confianza
          </p>
          <CreatePostDialog onPostCreated={refetch} />
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} placeholder="Buscar productos..." />
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Categorías populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Electrónicos', icon: '📱', count: posts.filter(p => p.title.toLowerCase().includes('electrón') || p.title.toLowerCase().includes('celular') || p.title.toLowerCase().includes('tv')).length },
              { name: 'Ropa', icon: '👕', count: posts.filter(p => p.title.toLowerCase().includes('ropa') || p.title.toLowerCase().includes('vestido') || p.title.toLowerCase().includes('camisa')).length },
              { name: 'Hogar', icon: '🏠', count: posts.filter(p => p.title.toLowerCase().includes('hogar') || p.title.toLowerCase().includes('mueble') || p.title.toLowerCase().includes('cocina')).length },
              { name: 'Deportes', icon: '⚽', count: posts.filter(p => p.title.toLowerCase().includes('deporte') || p.title.toLowerCase().includes('fútbol') || p.title.toLowerCase().includes('gimnasio')).length },
              { name: 'Libros', icon: '📚', count: posts.filter(p => p.title.toLowerCase().includes('libro') || p.title.toLowerCase().includes('novela')).length },
              { name: 'Juguetes', icon: '🧸', count: posts.filter(p => p.title.toLowerCase().includes('juguete') || p.title.toLowerCase().includes('niño')).length }
            ].map((category) => (
              <div
                key={category.name}
                className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} productos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publicaciones */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Todas las publicaciones'}
            </h2>
            <span className="text-muted-foreground text-sm">
              {posts.length} {posts.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery ? 'No se encontraron productos' : '¡Sé el primero en publicar!'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No encontramos productos que coincidan con "${searchQuery}". Intenta con otros términos.`
                    : 'Aún no hay publicaciones en el mercado. ¡Crea la primera!'
                  }
                </p>
                {!searchQuery && <CreatePostDialog onPostCreated={refetch} />}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Market;
