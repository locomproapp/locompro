import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageLightbox from '@/components/ImageLightbox';
import { getDisplayNameWithCurrentUser } from '@/utils/displayName';
import { useAuth } from '@/hooks/useAuth';
import BuyRequestActions from '@/components/BuyRequestActions';
const formatPrice = (min: number | null, max: number | null) => {
  const format = (p: number) => '$' + p.toLocaleString('es-AR');
  if (!min && !max) return 'Presupuesto abierto';
  if (min && max && min !== max) return `${format(min)} - ${format(max)}`;
  if (min) return `Desde ${format(min)}`;
  if (max) return `Hasta ${format(max)}`;
  return 'Presupuesto abierto';
};
const formatCondition = (condition: string | null) => {
  if (!condition || condition === null || condition === 'null') {
    return 'No especificado';
  }
  const map: {
    [key: string]: string;
  } = {
    'nuevo': 'Nuevo',
    'usado': 'Usado',
    'cualquiera': 'Cualquiera'
  };
  return map[condition] || condition.charAt(0).toUpperCase() + condition.slice(1);
};
const DetailsCard = ({
  buyRequest,
  buyRequestData
}: {
  buyRequest: any;
  buyRequestData: any;
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const {
    user
  } = useAuth();
  const isActive = buyRequest.status === 'active';

  // Get all images for lightbox
  let allImages: string[] = [];
  let coverImage: string | null = null;
  let totalImages = 0;
  if (buyRequestData?.images && Array.isArray(buyRequestData.images) && buyRequestData.images.length > 0) {
    const validImages = buyRequestData.images.filter((img: any) => img && typeof img === 'string');
    if (validImages.length > 0) {
      allImages = validImages;
      coverImage = validImages[0];
      totalImages = validImages.length;
    }
  } else if (buyRequestData?.reference_image && typeof buyRequestData.reference_image === 'string') {
    allImages = [buyRequestData.reference_image];
    coverImage = buyRequestData.reference_image;
    totalImages = 1;
  }

  // Get display name for publisher
  const displayName = getDisplayNameWithCurrentUser(buyRequest.profiles, buyRequest.user_id, user?.id);

  // Mock delete function for BuyRequestActions
  const handleDelete = async (id: string) => {
    // This would need to be implemented based on your actual delete logic
    return {
      success: false,
      error: 'Delete functionality not implemented'
    };
  };
  const handleUpdate = () => {
    // This would need to be implemented based on your actual update logic
    console.log('Update requested');
  };
  return <>
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm flex flex-col gap-6">
                {/* Mobile back button - only show on mobile */}
                <div className="md:hidden -mb-4">
                    <Button variant="ghost" asChild className="self-start">
                        <Link to="/marketplace" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver al mercado
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Hide status badge on mobile, show on desktop */}
                        <Badge variant={isActive ? "default" : "secondary"} className="hidden md:flex">
                            {isActive ? 'ACTIVA' : 'CERRADA'}
                        </Badge>
                        {buyRequest.categories && <Badge variant="outline" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {buyRequest.categories.name}
                            </Badge>}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        {buyRequest.title}
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Precio</h3>
                            <p className="text-lg text-primary font-bold">{formatPrice(buyRequest.min_price, buyRequest.max_price)}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Condición del producto</h3>
                            <p className="text-base text-foreground">{formatCondition(buyRequest.condition)}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Zona</h3>
                            <p className="text-base text-foreground">{buyRequest.zone}</p>
                        </div>

                        {buyRequest.description && buyRequest.description !== null && buyRequest.description !== 'null' && buyRequest.description.trim() !== '' && <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Características</h3>
                                <p className="text-base text-foreground whitespace-pre-wrap">
                                    {buyRequest.description}
                                </p>
                            </div>}

                        {/* Cover image section - only on mobile */}
                        {coverImage && <div className="md:hidden">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Fotos</h3>
                                <div className="relative">
                                    <button onClick={() => setLightboxOpen(true)} className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" aria-label="Ver imagen en tamaño completo">
                                        <img src={coverImage} alt="Imagen del producto" className="w-full h-64 object-cover rounded-lg border border-border" />
                                    </button>
                                    {/* Image position indicator - styled like other badges */}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="text-xs px-2 py-1">
                                            {1}/{totalImages}
                                        </Badge>
                                    </div>
                                </div>
                                
                                {/* Reference link below image - only on mobile */}
                                {buyRequest.reference_url && buyRequest.reference_url !== null && buyRequest.reference_url !== 'null' && buyRequest.reference_url.trim() !== '' && <div className="mt-3">
                                        <a href={buyRequest.reference_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                                            <ExternalLink className="h-4 w-4" />
                                            Ver enlace de referencia
                                        </a>
                                    </div>}
                            </div>}

                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha</h3>
                            <p className="text-base text-foreground">
                                {new Date(buyRequest.created_at).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                                    <p className="text-base text-foreground">{displayName}</p>
                                </div>
                                {/* Actions only visible on mobile */}
                                <div className="md:hidden">
                                    <BuyRequestActions buyRequestId={buyRequest.id} buyRequestTitle={buyRequest.title} buyRequestUserId={buyRequest.user_id} onDelete={handleDelete} onUpdate={handleUpdate} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox for full-screen image viewing */}
            {allImages.length > 0 && <ImageLightbox images={allImages} open={lightboxOpen} onOpenChange={setLightboxOpen} startIndex={0} />}
        </>;
};
export default DetailsCard;