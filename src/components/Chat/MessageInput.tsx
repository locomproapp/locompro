
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const MessageInput = ({ onSendMessage, isSending }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() && !isSending) {
      console.log('Sending message:', newMessage.trim());
      onSendMessage(newMessage.trim());
      setNewMessage('');
      
      // Keep focus on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Immediately prevent all default behaviors
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent native event propagation
      if (e.nativeEvent) {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
      
      // Send the message
      handleSendMessage();
      
      // Ensure the input doesn't lose focus and no scrolling occurs
      if (inputRef.current) {
        inputRef.current.blur();
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }
      
      return false;
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleSendMessage();
    return false;
  };

  return (
    <div className="p-4 border-t w-full" style={{ position: 'relative' }}>
      <form onSubmit={handleFormSubmit} className="w-full" noValidate>
        <div className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            disabled={isSending}
            className="flex-1"
            autoComplete="off"
            style={{ 
              outline: 'none',
              scrollBehavior: 'auto'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!newMessage.trim() || isSending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSendMessage();
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
