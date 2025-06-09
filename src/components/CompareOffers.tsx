
import React, { useState, useEffect } from 'react';
import { Offer } from '@/types/offer';
import { Button } from '@/components/ui/button';
import { Check, X, RotateCw, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import RejectOfferDialog from '@/components/RejectOfferDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CompareOffersProps {
  buyRequestId: string;
  isOwner: boolean;
}

const OfferRow = ({ offer, isOwner, refetch }: { offer: Offer, isOwner: boolean, refetch: () => void }) => {
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const acceptOffer = async (offerId: string) => {
    try {
      setIsAccepting(true);
      console.log('COMPARE OFFERS: Starting accept process for offer:', offerId);
      
      const { data: updateData, error } = await supabase
        .from('offers')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select();

      if (error) {
        console.error('COMPARE OFFERS: Database error:', error);
        throw error;
      }

      console.log('COMPARE OFFERS: Database update successful:', updateData);

      toast({
        title: 'Oferta aceptada',
        description: 'La oferta ha sido aceptada exitosamente',
      });

      // Trigger refetch to update the UI
      refetch();

      // Dispatch global event
      window.dispatchEvent(new CustomEvent('offerStatusChanged', { 
        detail: { offerId, newStatus: 'accepted' } 
      }));

    } catch (err) {
      console.error('COMPARE OFFERS: Error accepting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la oferta',
        variant: 'destructive',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectOffer = async (offerId: string, rejectionReason: string): Promise<void> => {
    try {
      console.log('COMPARE OFFERS: Starting rejection process for offer:', offerId);
      console.log('COMPARE OFFERS: Rejection reason:', rejectionReason);
      
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (error) {
        console.error('COMPARE OFFERS: Database update error:', error);
        throw error;
      }

      console.log('COMPARE OFFERS: Rejection successful');
      
      toast({
        title: 'Oferta rechazada',
        description: 'La oferta ha sido rechazada exitosamente',
      });

      // Trigger refetch to update the UI
      refetch();
      
    } catch (err) {
      console.error('COMPARE OFFERS: Error rejecting offer:', err);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la oferta',
        variant: 'destructive',
      });
      throw err; // Re-throw to let the dialog handle it
    }
  };

  const canAcceptOrReject = isOwner && offer.status === 'pending';
  const isWithdrawn = offer.status === 'withdrawn';
  const isRejected = offer.status === 'rejected';
  const isAccepted = offer.status === 'accepted';

  const renderActions = () => {
    if (canAcceptOrReject) {
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => acceptOffer(offer.id)}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Aceptando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Aceptar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectDialog(true)}
            disabled={isAccepting}
          >
            <X className="mr-2 h-4 w-4" />
            Rechazar
          </Button>
          <RejectOfferDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            onConfirm={(reason) => handleRejectOffer(offer.id, reason)}
            isLoading={isAccepting}
          />
        </div>
      );
    }

    if (!isOwner && offer.status === 'pending') {
      return (
        <span className="text-sm text-muted-foreground">
          Solo el comprador puede aceptar/rechazar
        </span>
      );
    }

    // For finalized offers
    if (isAccepted) {
      return (
        <span className="text-sm text-green-600 font-medium">
          ✓ Oferta aceptada
        </span>
      );
    }

    if (isRejected) {
      return (
        <span className="text-sm text-red-600 font-medium">
          ✗ Oferta rechazada
        </span>
      );
    }

    if (isWithdrawn) {
      return (
        <span className="text-sm text-gray-600 font-medium">
          Oferta retirada
        </span>
      );
    }

    return null;
  };

  return (
    <TableRow key={offer.id}>
      {/* Imagen */}
      <TableCell className="w-16">
        {offer.images && offer.images.length > 0 ? (
          <img
            src={offer.images[0]}
            alt="Preview"
            className="w-12 h-12 object-cover rounded border"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </TableCell>

      {/* Título clickeable */}
      <TableCell className="font-medium">
        <Link 
          to={`/offer/${offer.id}`}
          className="text-primary hover:underline"
        >
          {offer.title}
        </Link>
      </TableCell>

      <TableCell>${offer.price}</TableCell>

      <TableCell>
        {offer.profiles ? (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={undefined} alt={offer.profiles.full_name || 'Seller'} />
              <AvatarFallback>{offer.profiles.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span>{offer.profiles.full_name || 'Usuario anónimo'}</span>
          </div>
        ) : (
          'Usuario anónimo'
        )}
      </TableCell>

      <TableCell>
        {isAccepted ? (
          <Badge variant="success">Aceptada</Badge>
        ) : isRejected ? (
          <Badge variant="destructive">Rechazada</Badge>
        ) : isWithdrawn ? (
          <Badge variant="secondary">Retirada</Badge>
        ) : (
          <Badge variant="default">Pendiente</Badge>
        )}
      </TableCell>

      <TableCell>
        {renderActions()}
      </TableCell>
    </TableRow>
  );
};

const CompareOffers = ({ buyRequestId, isOwner }: CompareOffersProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const { toast } = useToast();

  const fetchOffers = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('buy_request_id', buyRequestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        setError(error.message);
      } else {
        // Transform the data with proper type casting
        const transformedOffers: Offer[] = (data || []).map(offer => ({
          ...offer,
          price_history: offer.price_history as Array<{
            price: number;
            timestamp: string;
            type: 'rejected' | 'initial';
          }> | null,
          profiles: offer.profiles || null
        }));
        
        setOffers(transformedOffers);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching offers:', err);
      setError('Failed to load offers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [buyRequestId]);

  const closeBuyRequest = async () => {
    setIsClosing(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .update({ status: 'closed' })
        .eq('id', buyRequestId);

      if (error) {
        console.error('Error closing buy request:', error);
        toast({
          title: 'Error',
          description: 'Failed to close buy request.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Buy request closed',
          description: 'This buy request is now closed.',
        });
        // Refresh the offers and potentially the buy request details
        fetchOffers();
      }
    } finally {
      setIsClosing(false);
    }
  };

  const hasPendingOffers = offers.some(offer => offer.status === 'pending');
  const allOffersRejectedOrWithdrawn = offers.every(offer => offer.status === 'rejected' || offer.status === 'withdrawn');
  const buyRequestClosed = offers.every(offer => offer.status === 'accepted');

  if (loading) {
    return <p>Cargando ofertas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comparar ofertas</h2>
      {offers.length === 0 ? (
        <div className="p-4 border rounded-md bg-muted text-muted-foreground">
          <p>No hay ofertas para esta solicitud.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>Lista de ofertas para esta solicitud. Haz click en el título para ver detalles completos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Mis acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <OfferRow key={offer.id} offer={offer} isOwner={isOwner} refetch={fetchOffers} />
            ))}
          </TableBody>
        </Table>
      )}

      {isOwner && !buyRequestClosed && hasPendingOffers && (
        <div className="mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isClosing}>
                {isClosing ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Cerrando...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Cerrar solicitud
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar la solicitud?</AlertDialogTitle>
                <AlertDialogDescription>
                  Al cerrar la solicitud, ninguna oferta podrá ser aceptada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={closeBuyRequest}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {isOwner && allOffersRejectedOrWithdrawn && (
        <div className="mt-4 p-4 border rounded-md bg-muted text-muted-foreground">
          <p>Todas las ofertas han sido rechazadas o retiradas.</p>
        </div>
      )}
    </div>
  );
};

export default CompareOffers;
