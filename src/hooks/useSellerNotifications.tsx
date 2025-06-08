
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
        .select(`
          id, 
          title, 
          rejection_reason, 
          updated_at, 
          status,
          price,
          buy_requests (
            title,
            zone
          )
        `)
        .eq('seller_id', user.id)
        .eq('status', 'rejected')
        .not('rejection_reason', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  useEffect(() => {
    if (notifications) {
      setNotificationCount(notifications.length);
    }
  }, [notifications]);

  // Enhanced real-time subscription for seller notifications
  useEffect(() => {
    if (!user) return;

    console.log('Setting up seller notifications real-time subscription for user:', user.id);

    const channel = supabase
      .channel('seller-notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Seller notification - offer updated:', payload);
          
          // Check if offer was rejected with a reason
          if (payload.new.status === 'rejected' && payload.new.rejection_reason) {
            console.log('Offer rejected with reason, showing notification');
            toast({
              title: "Oferta rechazada",
              description: `Tu oferta "${payload.new.title}" fue rechazada. Ve a notificaciones para ver los detalles.`,
              variant: "destructive"
            });
          }
          
          // Refetch notifications immediately
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Seller notifications subscription status:', status);
      });

    return () => {
      console.log('Cleaning up seller notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return {
    notificationCount,
    notifications,
    refetch
  };
};
