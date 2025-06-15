
import React from 'react';
import ImageGallery from '@/components/ImageGallery';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageAndActionsCardProps {
  buyRequest: any;
  user?: { id: string };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ImageAndActionsCard = ({
  buyRequest,
  user,
  onEdit,
  onDelete,
}: ImageAndActionsCardProps) => {
  const allImages = buyRequest.images?.length
    ? buyRequest.images
    : buyRequest.reference_image
    ? [buyRequest.reference_image]
    : [];

  const isOwner = user?.id === buyRequest.user_id;

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="relative bg-card rounded-lg border border-border p-4 shadow-sm">
        {/* Icons only if isOwner */}
        {isOwner && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              aria-label="Editar"
              onClick={() => onEdit && onEdit(buyRequest.id)}
              className="p-1 rounded hover:bg-transparent transition group"
              tabIndex={0}
              type="button"
            >
              <Edit className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button
              aria-label="Eliminar"
              onClick={() => onDelete && onDelete(buyRequest.id)}
              className="p-1 rounded hover:bg-transparent transition group"
              tabIndex={0}
              type="button"
            >
              <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        )}
        <ImageGallery images={allImages} />
      </div>
      {buyRequest.reference_url && (
        <Button asChild className="w-full">
          <a href={buyRequest.reference_url} target="_blank" rel="noopener noreferrer">
            Ver enlace de referencia
          </a>
        </Button>
      )}
    </div>
  );
};

export default ImageAndActionsCard;

