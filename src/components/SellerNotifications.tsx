
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
  status: string;
  updated_at: string;
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
          status,
          updated_at,
          buy_requests!inner (
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
      return data.map(item => ({
        ...item,
        buy_requests: item.buy_requests || { title: 'Solicitud eliminada', zone: 'N/A' }
      })) as RejectedOffer[];
    },
    enabled: !!user,
    refetchInterval: 10000
  });

  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time offer update:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

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

  const getStatusBadge = (status: string) => {
    if (status === 'rejected') {
      return (
        <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Rechazada
        </Badge>
      );
    }
    return <Badge variant="secondary" className="text-xs">{status}</Badge>;
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
                {getStatusBadge(offer.status)}
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
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Rechazada el {formatDate(offer.updated_at)}
                </p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Estado: {offer.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SellerNotifications;
