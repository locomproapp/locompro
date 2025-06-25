
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SendOfferForm, useSendOfferLogic } from '@/components/SendOffer';

const SendOffer = () => {
  const {
    user,
    buyRequest,
    buyRequestLoading,
    isCounterOffer,
    editOfferId,
    actualBuyRequestId,
    buyRequestId,
    initialFormValues,
    handleSubmit
  } = useSendOfferLogic();

  if (buyRequestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Acceso requerido
            </h1>
            <p className="text-muted-foreground mb-6">
              Debes iniciar sesión para enviar una oferta.
            </p>
            <Button asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!buyRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Solicitud no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La solicitud que buscas no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link to="/marketplace">Volver al marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const targetBuyRequestId = actualBuyRequestId || buyRequestId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/buy-request/${targetBuyRequestId}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a la solicitud
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isCounterOffer ? 'Enviar Contraoferta' : editOfferId ? 'Editar Oferta' : 'Enviar Oferta'}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Para: <span className="font-medium">{buyRequest?.title}</span>
          </p>
          {isCounterOffer && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded border">
              Estás editando una oferta rechazada. Puedes modificar los datos y reenviarla.
            </p>
          )}
        </div>

        <SendOfferForm
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          targetBuyRequestId={targetBuyRequestId}
          isCounterOffer={isCounterOffer}
          editOfferId={editOfferId}
        />
      </main>

      <Footer />
    </div>
  );
};

export default SendOffer;
