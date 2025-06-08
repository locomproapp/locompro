
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RejectedOffer {
  id: string;
  title: string;
  price: number;
  rejection_reason: string;
  created_at: string;
  buy_requests: {
    title: string;
    zone: string;
  } | null;
}

const SellerNotifications = () => {
  const { user } = useAuth();

  const { data: rejectedOffers, isLoading, refetch } = useQuery({
    queryKey: ['rejected-offers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          title,
          price,
          rejection_reason,
          created_at,
          buy_requests (
            title,
            zone
          )
        `)
        .eq('seller_id', user.id)
        .eq('status', 'rejected')
        .not('rejection_reason', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as RejectedOffer[];
    },
    enabled: !!user
  });

  const markAsRead = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ rejection_reason: null })
        .eq('id', offerId);

      if (error) throw error;
      
      toast({
        title: "Notificación marcada como leída",
        description: "La notificación ha sido eliminada"
      });
      
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Cargando notificaciones...</p>
        </CardContent>
      </Card>
    );
  }

  if (!rejectedOffers || rejectedOffers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No tienes notificaciones nuevas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificaciones ({rejectedOffers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rejectedOffers.map((offer) => (
          <div key={offer.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Badge variant="destructive" className="text-xs">
                  Oferta Rechazada
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(offer.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="font-medium text-sm">{offer.title}</p>
                <p className="text-xs text-muted-foreground">
                  Para: {offer.buy_requests?.title} ({offer.buy_requests?.zone})
                </p>
                <p className="text-xs text-muted-foreground">
                  Precio ofrecido: ${offer.price}
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Motivo del rechazo:
                </p>
                <p className="text-sm text-red-700">{offer.rejection_reason}</p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {formatDate(offer.created_at)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SellerNotifications;
