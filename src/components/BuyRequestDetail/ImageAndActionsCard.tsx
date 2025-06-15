
import React from 'react';
import ImageGallery from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';

const ImageAndActionsCard = ({ buyRequest }: { buyRequest: any }) => {
    const allImages = buyRequest.images?.length
        ? buyRequest.images
        : (buyRequest.reference_image ? [buyRequest.reference_image] : []);

    return (
        <div className="flex flex-col gap-4 sticky top-24">
            <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
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
