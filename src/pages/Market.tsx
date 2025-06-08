
import React from 'react';
import Navigation from '@/components/Navigation';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Market = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del mercado */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mercado LoCompro
          </h1>
          <p className="text-lg text-muted-foreground">
            Descubre miles de productos de vendedores de confianza
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Botones de filtro y vista */}
            <div className="flex gap-2">
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
              { name: 'Electrónicos', icon: '📱', count: '1,234' },
              { name: 'Ropa', icon: '👕', count: '2,567' },
              { name: 'Hogar', icon: '🏠', count: '987' },
              { name: 'Deportes', icon: '⚽', count: '654' },
              { name: 'Libros', icon: '📚', count: '432' },
              { name: 'Juguetes', icon: '🧸', count: '876' }
            ].map((category) => (
              <div
                key={category.name}
                className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
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

        {/* Estado vacío del mercado */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              ¡El mercado está en construcción!
            </h3>
            <p className="text-muted-foreground mb-6">
              Pronto podrás encontrar miles de productos increíbles aquí. 
              Mientras tanto, puedes explorar las categorías disponibles.
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Notificarme cuando esté listo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Market;
