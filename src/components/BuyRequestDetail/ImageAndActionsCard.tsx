
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditBuyRequestDialog from '@/components/EditBuyRequestDialog';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface BuyRequestData {
  id: string;
  title: string;
  description: string | null;
  min_price: number;
  max_price: number;
  zone: string;
  condition: string;
  reference_image: string | null;
  reference_url: string | null;
  status: string;
  created_at: string;
  user_id: string;
  images: string[] | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface User {
  id: string;
  email?: string;
}

interface ImageAndActionsCardProps {
  buyRequest: BuyRequestData;
  user: User | null;
  onUpdate: () => void;
  disableActions?: boolean;
}

const ImageAndActionsCard = ({ buyRequest, user, onUpdate, disableActions = false }: ImageAndActionsCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === buyRequest.user_id;
  const isFinalized = buyRequest.status === 'finalized';

  const formatPrice = (min: number, max: number) => {
    const format = (p: number) => '$' + p.toLocaleString('es-AR');
    if (min === max) return format(min);
    return `${format(min)} - ${format(max)}`;
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('buy_requests')
        .delete()
        .eq('id', buyRequest.id);

      if (error) throw error;

      toast({
        title: "Solicitud eliminada",
        description: "La solicitud ha sido eliminada exitosamente"
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Error deleting buy request:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la solicitud",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Image Gallery */}
      <div className="aspect-video bg-muted overflow-hidden">
        {buyRequest.reference_image ? (
          <img
            src={buyRequest.reference_image}
            alt={buyRequest.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
            {formatPrice(buyRequest.min_price, buyRequest.max_price)}
          </Badge>
          
          {/* Status badge */}
          {isFinalized && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Finalizada
            </Badge>
          )}
        </div>

        {buyRequest.reference_url && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a
              href={buyRequest.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Ver referencia externa
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Zona:</span>
            <p className="mt-1">{buyRequest.zone}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Condición:</span>
            <p className="mt-1 capitalize">{buyRequest.condition}</p>
          </div>
        </div>

        {/* Owner Actions - only show if owner and not finalized and not disabled */}
        {isOwner && !isFinalized && !disableActions && (
          <div className="flex gap-2 pt-4 border-t">
            <EditBuyRequestDialog 
              buyRequestId={buyRequest.id}
              onUpdate={onUpdate}
            >
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </EditBuyRequestDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente la solicitud "{buyRequest.title}".
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Show message if finalized */}
        {isFinalized && (
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-orange-700 bg-orange-50 px-3 py-2 rounded-md">
              Esta solicitud ha sido finalizada. Se aceptó una oferta y ya no se pueden realizar cambios.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageAndActionsCard;
