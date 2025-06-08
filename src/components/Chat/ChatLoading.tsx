
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const ChatLoading = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center py-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Iniciando chat...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatLoading;
