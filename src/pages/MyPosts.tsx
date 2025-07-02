
import React from 'react';
import Navigation from '@/components/Navigation';
import CreatePostDialog from '@/components/CreatePostDialog';
import BuyRequestCard from '@/components/BuyRequestCard';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useAuth } from '@/hooks/useAuth';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const { user } = useAuth();
  const { posts, loading, refetch, deletePost } = useUserPosts();

  const handleDelete = async (id: string) => {
    return await deletePost(id);
  };

  const handleUpdate = () => {
    refetch();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 sm:p-12 text-center">
            <h1 className="text-xl sm:text-2xl font-medium text-foreground mb-4">
              Inicia sesión para ver tus publicaciones
            </h1>
            <p className="text-muted-foreground">
              Necesitas estar logueado para acceder a esta sección.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Desktop */}
        <div className="mb-8 hidden sm:block">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-2">
                Mis Publicaciones
              </h1>
              <p className="text-lg text-muted-foreground">
                Gestiona tus productos publicados
              </p>
            </div>
            <CreatePostDialog onPostCreated={refetch} />
          </div>
        </div>

        {/* Header - Mobile */}
        <div className="mb-8 block sm:hidden">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Mis Publicaciones
          </h1>
          <p className="text-muted-foreground mb-6">Gestiona tus productos publicados</p>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aún no tienes publicaciones
              </h3>
              <p className="text-muted-foreground mb-6">Cuando crees publicaciones van a aparecer acá</p>
              <CreatePostDialog onPostCreated={refetch} />
              
              <div className="bg-card rounded-lg border border-border shadow-sm p-6 text-center mt-8">
                <div className="max-w-md mx-auto">
                  <p className="text-muted-foreground">
                    Crea tu primera publicación y comienza a vender tus productos.
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Aún no tienes publicaciones
                  </h3>
                  <p className="text-muted-foreground">
                    Crea tu primera publicación y comienza a vender tus productos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6">
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? 'publicación' : 'publicaciones'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post) => (
                <BuyRequestCard 
                  key={post.id} 
                  buyRequest={post}
                  showActions={true}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  hideBuscoTag={true}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyPosts;
