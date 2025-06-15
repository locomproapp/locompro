
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PostDetailError = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Publicación no encontrada
          </h1>
          <p className="text-muted-foreground mb-6">
            La publicación que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link to="/market">Volver al mercado</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailError;
