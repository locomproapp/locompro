
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useSellerNotifications = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: notifications, refetch } = useQuery({
    queryKey: ['seller-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('offers')
        .select('id, title, rejection_reason, updated_at')
        .eq('seller_id', user.id)
        .eq('status', 'rejected')
        .not('rejection_reason', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  useEffect(() => {
    if (notifications) {
      setNotificationCount(notifications.length);
    }
  }, [notifications]);

  // Subscribe to real-time updates for offers
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('seller-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Offer updated:', payload);
          
          // If an offer was rejected with a reason, show toast notification
          if (payload.new.status === 'rejected' && payload.new.rejection_reason) {
            toast({
              title: "Oferta rechazada",
              description: `Tu oferta "${payload.new.title}" fue rechazada. Ve a notificaciones para ver los detalles.`,
              variant: "destructive"
            });
          }
          
          // Refetch notifications
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return {
    notificationCount,
    notifications,
    refetch
  };
};
