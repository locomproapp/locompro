
import React from 'react';
import Navigation from '@/components/Navigation';
import CreatePostDialog from '@/components/CreatePostDialog';
import BuyRequestCard from '@/components/BuyRequestCard';
import { useUserPosts } from '@/hooks/useUserPosts';
import { useAuth } from '@/hooks/useAuth';
import { Plus, FileText } from 'lucide-react';

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
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                Mis Publicaciones
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Gestiona tus productos publicados
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <CreatePostDialog onPostCreated={refetch} />
            </div>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando tus publicaciones...</p>
          </div>
        ) : posts.length > 0 ? (
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
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm p-6 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                Aún no tienes publicaciones
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera publicación y comienza a vender tus productos.
              </p>
              <CreatePostDialog onPostCreated={refetch} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPosts;
