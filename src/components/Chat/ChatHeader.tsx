
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const ChatHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Chat con el vendedor
      </CardTitle>
    </CardHeader>
  );
};

export default ChatHeader;
