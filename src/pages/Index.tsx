
import React from 'react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Encuentra lo que necesitas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            LoCompro es tu marketplace de confianza. Compra y vende de forma segura y sencilla.
          </p>
        </div>
        
        {/* Search section */}
        <div className="w-full max-w-4xl mb-16">
          <SearchBar />
        </div>
        
        {/* Quick categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-foreground">Electrónicos</h3>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="font-semibold text-foreground">Ropa</h3>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-foreground">Hogar</h3>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold text-foreground">Autos</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
