
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchBuyRequests from '@/components/SearchBuyRequests';
import TransactionHistory from '@/components/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del marketplace */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mercado
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Acá se encuentran las publicaciones de los que quieren comprar un producto
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar solicitudes
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Publicar solicitud
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Mi historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <SearchBuyRequests />
          </TabsContent>

          <TabsContent value="post" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Publicar solicitud de compra</h2>
                <p className="text-muted-foreground mb-6">
                  Cuéntanos qué estás buscando y recibe ofertas de vendedores
                </p>
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link to="/create-buy-request">
                    <Plus className="h-4 w-4" />
                    Crear Solicitud de Compra
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
