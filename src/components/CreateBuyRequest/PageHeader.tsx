
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = () => {
  return (
    <div className="mb-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Crear Solicitud de Compra
      </h1>
      <p className="text-lg text-muted-foreground">
        Describí exactamente qué estás buscando y recibí ofertas personalizadas de vendedores
      </p>
    </div>
  );
};

export default PageHeader;
