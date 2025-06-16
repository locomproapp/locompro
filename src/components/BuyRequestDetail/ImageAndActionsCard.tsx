
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
  const allImages = buyRequest.images?.length
    ? buyRequest.images
    : buyRequest.reference_image
    ? [buyRequest.reference_image]
    : [];

  const isOwner = user?.id === buyRequest.user_id;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRequest = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('buy_requests')
        .delete()
        .eq('id', buyRequest.id);

      if (error) throw error;
      toast({
        title: '¡Publicación eliminada!',
        description: 'La publicación fue borrada exitosamente.'
      });
      setDeleteDialogOpen(false);
      navigate('/marketplace');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la publicación.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
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
          onUpdate={onUpdate || (() => window.location.reload())}
        />
      )}

      {buyRequest.reference_url && (
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
