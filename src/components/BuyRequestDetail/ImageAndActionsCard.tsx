
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageGallery from '@/components/ImageGallery';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditBuyRequestDialog from '@/components/EditBuyRequestDialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageAndActionsCardProps {
  buyRequest: any;
  user?: { id: string };
  onUpdate?: () => void;
}

const ImageAndActionsCard = ({
  buyRequest,
  user,
  onUpdate,
}: ImageAndActionsCardProps) => {
  // Lógica para construir el array de imágenes
  let allImages: string[] = [];
  
  if (buyRequest.images && Array.isArray(buyRequest.images) && buyRequest.images.length > 0) {
    // Si hay un array de imágenes, usarlo
    allImages = buyRequest.images.filter((img: any) => img && typeof img === 'string');
  } else if (buyRequest.reference_image && typeof buyRequest.reference_image === 'string') {
    // Si no hay array pero sí reference_image, usar solo esa
    allImages = [buyRequest.reference_image];
  }

  const isOwner = user?.id === buyRequest.user_id;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRequest = async () => {
    setDeleting(true);
    try {
      console.log('Starting deletion process for buy request:', buyRequest.id);
      console.log('User ID:', user?.id);
      console.log('Buy request user ID:', buyRequest.user_id);
      
      // Verify user owns the request
      if (user?.id !== buyRequest.user_id) {
        throw new Error('User does not own this buy request');
      }

      // First, verify the buy request exists before deletion
      const { data: existingRequest, error: checkError } = await supabase
        .from('buy_requests')
        .select('id, user_id')
        .eq('id', buyRequest.id)
        .single();

      if (checkError) {
        console.error('Error checking buy request existence:', checkError);
        throw new Error(`Cannot verify buy request exists: ${checkError.message}`);
      }

      if (!existingRequest) {
        throw new Error('Buy request not found in database');
      }

      console.log('Buy request exists, proceeding with deletion...');

      // Delete related offers first
      const { error: offersError, count: deletedOffersCount } = await supabase
        .from('buy_request_offers')
        .delete({ count: 'exact' })
        .eq('buy_request_id', buyRequest.id);

      if (offersError) {
        console.error('Error deleting related offers:', offersError);
        // Continue with buy request deletion even if offers deletion fails
      } else {
        console.log(`Deleted ${deletedOffersCount || 0} related offers`);
      }

      // Then delete the buy request
      const { error: deleteError, count: deletedCount } = await supabase
        .from('buy_requests')
        .delete({ count: 'exact' })
        .eq('id', buyRequest.id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      console.log(`Deleted ${deletedCount || 0} buy request(s)`);

      if (deletedCount === 0) {
        throw new Error('No buy request was deleted - possibly already deleted or permission denied');
      }

      // Verify deletion by trying to fetch the deleted request
      const { data: verifyDeleted, error: verifyError } = await supabase
        .from('buy_requests')
        .select('id')
        .eq('id', buyRequest.id)
        .maybeSingle();

      if (verifyError) {
        console.error('Error verifying deletion:', verifyError);
      } else if (verifyDeleted) {
        console.error('WARNING: Buy request still exists after deletion!', verifyDeleted);
        throw new Error('Deletion verification failed - request still exists');
      } else {
        console.log('✅ Deletion verified - buy request no longer exists in database');
      }
      
      toast({
        title: '¡Publicación eliminada!',
        description: 'La publicación fue borrada exitosamente.'
      });
      
      setDeleteDialogOpen(false);

      // Dispatch global deletion event before navigation
      console.log('Dispatching buyRequestDeleted event...');
      window.dispatchEvent(new CustomEvent('buyRequestDeleted', { 
        detail: { buyRequestId: buyRequest.id } 
      }));
      
      // Small delay to ensure event is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate with deletion flag and immediate cache invalidation
      console.log('Navigating to marketplace with deletion state...');
      navigate('/marketplace', { 
        state: { 
          deletedRequestId: buyRequest.id,
          refresh: true,
          timestamp: Date.now()
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Error deleting buy request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar la publicación. Por favor, intenta nuevamente.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleEditUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
    // Dispatch global event to update marketplace and other views
    window.dispatchEvent(new CustomEvent('buyRequestUpdated', { 
      detail: { buyRequestId: buyRequest.id } 
    }));
  };

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm flex flex-col gap-4">
        {isOwner && (
          <div className="flex gap-2 justify-end">
            <button
              aria-label="Editar"
              onClick={() => setEditOpen(true)}
              className="p-1 rounded hover:bg-transparent transition group"
              tabIndex={0}
              type="button"
            >
              <Edit className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  aria-label="Eliminar"
                  className="p-1 rounded hover:bg-transparent transition group"
                  tabIndex={0}
                  type="button"
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que querés borrar esta solicitud? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRequest} disabled={deleting}>
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        
        <ImageGallery images={allImages} />
      </div>

      {isOwner && (
        <EditBuyRequestDialog
          buyRequestId={buyRequest.id}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdate={handleEditUpdate}
        />
      )}

      {buyRequest.reference_url && buyRequest.reference_url !== null && buyRequest.reference_url !== 'null' && buyRequest.reference_url.trim() !== '' && (
        <Button asChild className="w-full">
          <a href={buyRequest.reference_url} target="_blank" rel="noopener noreferrer">
            Ver producto de referencia
          </a>
        </Button>
      )}
    </div>
  );
};

export default ImageAndActionsCard;
