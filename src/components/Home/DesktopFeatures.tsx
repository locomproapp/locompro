
import React from 'react';
import { Search, Package, Handshake } from 'lucide-react';

const DesktopFeatures = () => {
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3">Publicá el producto que buscás</h3>
        <p className="text-muted-foreground">Describí que buscás, con características, tu presupuesto y de dónde sos.</p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3">Recibí ofertas</h3>
        <p className="text-muted-foreground">
          La gente que tenga lo que buscás te lo va a ofrecer.
        </p>
      </div>
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Handshake className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3">Elegí la mejor</h3>
        <p className="text-muted-foreground">
          Compará las ofertas y quedate con la que más te sirva.
        </p>
      </div>
    </div>
  );
};

export default DesktopFeatures;
