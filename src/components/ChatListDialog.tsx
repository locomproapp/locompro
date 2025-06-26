
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import ChatList from './ChatList';

const ChatListDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleChatSelect = (chatId: string) => {
    console.log('Chat selected:', chatId);
    // Here you could navigate to a specific chat page or open the chat in a new modal
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mis Chats</DialogTitle>
        </DialogHeader>
        <ChatList onChatSelect={handleChatSelect} />
      </DialogContent>
    </Dialog>
  );
};

export default ChatListDialog;
