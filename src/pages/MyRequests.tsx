
import React from 'react';
import Navigation from '@/components/Navigation';
import { CreateBuyRequestDialog } from '@/components/BuyRequest';
import BuyRequestCard from '@/components/BuyRequestCard';
import { useUserBuyRequests } from '@/hooks/useUserBuyRequests';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search } from 'lucide-react';
import Footer from '@/components/Footer';

const MyRequests = () => {
  const { user } = useAuth();
  const { buyRequests, loading, refetch, deleteBuyRequest } = useUserBuyRequests();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Inicia sesión para ver tus publicaciones
            </h1>
            <p className="text-muted-foreground">
              Necesitas estar logueado para acceder a esta sección.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Triple check - only show requests that are 100% owned by the current user
  const strictlyUserOwnedRequests = buyRequests.filter(request => {
    const isStrictlyOwned = request.user_id === user.id && request.user_id != null;
    console.log(`Final filter - Request ${request.id}: owned=${isStrictlyOwned}`);
    return isStrictlyOwned;
  });

  console.log('Final requests to display:', strictlyUserOwnedRequests.length);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Mis publicaciones
              </h1>
              <p className="text-lg text-muted-foreground">
                Acá podés ver las publicaciones que creaste.
              </p>
            </div>
            <CreateBuyRequestDialog onRequestCreated={refetch} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground">Cargando tus publicaciones...</p>
          </div>
        ) : strictlyUserOwnedRequests.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {strictlyUserOwnedRequests.length} {strictlyUserOwnedRequests.length === 1 ? 'publicación' : 'publicaciones'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strictlyUserOwnedRequests.map((request) => (
                <BuyRequestCard 
                  key={request.id} 
                  buyRequest={request}
                  showActions={true}
                  onDelete={deleteBuyRequest}
                  onUpdate={refetch}
                  hideBuscoTag={true}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aún no tienes publicaciones
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera publicación de compra y recibe ofertas de vendedores.
              </p>
              <CreateBuyRequestDialog onRequestCreated={refetch} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyRequests;
