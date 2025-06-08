
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BuyRequestCard from '@/components/BuyRequestCard';
import CreateBuyRequestDialog from '@/components/CreateBuyRequestDialog';
import { Button } from '@/components/ui/button';
import { Search, Package, Handshake, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

const Index = () => {
  const { data: buyRequests = [], refetch } = useQuery({
    queryKey: ['recent-buy-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('buy_requests')
        .select(`
          *,
          profiles (full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as BuyRequest[];
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            ¿Qué estás <span className="text-primary">buscando</span>?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas. 
            Encontrá exactamente lo que necesitás al mejor precio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/market">
                <Search className="mr-2 h-5 w-5" />
                Explorar Mercado
              </Link>
            </Button>
            <CreateBuyRequestDialog onRequestCreated={refetch} />
          </div>
        </div>

        {/* Recent Buy Requests */}
        {buyRequests.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Solicitudes recientes</h2>
              <Button asChild variant="outline">
                <Link to="/market">Ver todas</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyRequests.map((request) => (
                <BuyRequestCard key={request.id} buyRequest={request} showOfferButton={true} />
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Publicá tu búsqueda</h3>
            <p className="text-muted-foreground">
              Describí exactamente qué estás buscando, tu presupuesto y zona de entrega
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Recibí ofertas</h3>
            <p className="text-muted-foreground">
              Los vendedores que tengan lo que buscás te enviarán ofertas personalizadas
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Elegí la mejor</h3>
            <p className="text-muted-foreground">
              Compará ofertas y elegí la que mejor se adapte a tus necesidades
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card rounded-lg border border-border p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">¿Por qué LoCompro?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Compra segura</h3>
                <p className="text-muted-foreground">
                  Los vendedores compiten por tu atención con las mejores ofertas
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Encontrá cualquier cosa</h3>
                <p className="text-muted-foreground">
                  Desde productos específicos hasta servicios personalizados
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ahorrá tiempo</h3>
                <p className="text-muted-foreground">
                  No busques más, que los vendedores vengan a vos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Handshake className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Mejores precios</h3>
                <p className="text-muted-foreground">
                  La competencia entre vendedores resulta en mejores ofertas para vos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Únete a miles de usuarios que ya encontraron lo que buscaban
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/market">
              Empezar Ahora
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
