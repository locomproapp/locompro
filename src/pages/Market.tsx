
import React from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { CreateUserPostDialog } from '@/components/CreateUserPost';
import { usePosts } from '@/hooks/usePosts';
import PostCard from '@/components/PostCard';

const Market = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { posts, loading, error, refetch } = usePosts(searchQuery);

  const handlePostCreated = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Mercado de Solicitudes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Descubre lo que otros están buscando y encuentra oportunidades de venta perfectas para ti
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar productos o solicitudes..."
            />
            <CreateUserPostDialog onPostCreated={handlePostCreated} />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Cargando publicaciones...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-destructive">Error al cargar las publicaciones</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No se encontraron publicaciones' : 'No hay publicaciones disponibles'}
              </p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Market;
