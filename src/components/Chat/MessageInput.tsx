
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const MessageInput = ({ onSendMessage, isSending }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isSending}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={!newMessage.trim() || isSending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
