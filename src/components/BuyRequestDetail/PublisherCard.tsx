
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
    console.log('PublisherCard - buyRequest.profiles:', buyRequest.profiles);
    
    // Get the full name - no fallback to anonymous
    const getDisplayName = () => {
        return buyRequest.profiles?.full_name || 'Sin nombre';
    };

    // Get avatar URL
    const getAvatarUrl = () => {
        return buyRequest.profiles?.avatar_url || undefined;
    };

    // Get location
    const getLocation = () => {
        return buyRequest.profiles?.location || null;
    };
    
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Fecha de publicación</h3>
                <p className="text-base text-foreground">{formatDate(buyRequest.created_at)}</p>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Publicado por</h3>
                <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={getAvatarUrl()}
                            alt={getDisplayName()}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {getDisplayName().charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium text-foreground">
                            {getDisplayName()}
                        </p>
                        {getLocation() && (
                            <p className="text-sm text-muted-foreground">
                                {getLocation()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublisherCard;
