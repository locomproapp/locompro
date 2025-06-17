
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const OfferDetailLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando detalles de la oferta...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OfferDetailLoading;
