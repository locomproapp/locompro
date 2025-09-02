import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CreateBuyRequestForm } from '@/components/BuyRequest';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const CreateBuyRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from === "/marketplace" ? "/marketplace" : "/";
  const backLinkHref = from === "/marketplace" ? "/marketplace" : "/";
  const backLinkText = from === "/marketplace" ? "← Volver al mercado" : "← Volver al inicio";
  const handleCancel = () => {
    navigate(backLinkHref, {
      replace: true
    });
    window.scrollTo(0, 0);
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(3.5rem+env(safe-area-inset-top)+2rem)] py-8">
        <div className="bg-card rounded-lg border border-border p-8">
          <div className="mb-4">
            <Link to={backLinkHref} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {backLinkText}
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Crear Publicación
            </h1>
            <p className="text-muted-foreground">Describí el producto que querés comprar</p>
          </div>

          <CreateBuyRequestForm onCancel={handleCancel} />
        </div>
      </main>

      <Footer />
    </div>;
};
export default CreateBuyRequest;