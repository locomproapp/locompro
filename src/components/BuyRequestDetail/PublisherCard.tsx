
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
};

const PublisherCard = ({ buyRequest }: { buyRequest: any }) => {
    return (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4 shadow-sm">
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha de publicación</h3>
                <p className="text-base text-foreground">{formatDate(buyRequest.created_at)}</p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={buyRequest.profiles?.avatar_url || undefined}
                            alt={buyRequest.profiles?.full_name || 'Usuario'}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {buyRequest.profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium text-foreground">
                            {buyRequest.profiles?.full_name || 'Usuario anónimo'}
                        </p>
                        {buyRequest.profiles?.location && (
                            <p className="text-sm text-muted-foreground">
                                {buyRequest.profiles.location}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublisherCard;
