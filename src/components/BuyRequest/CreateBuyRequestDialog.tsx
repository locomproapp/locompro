import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateBuyRequestForm from './CreateBuyRequestForm';
interface CreateBuyRequestDialogProps {
  onRequestCreated?: () => void;
}
const CreateBuyRequestDialog = ({
  onRequestCreated
}: CreateBuyRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Publicación</DialogTitle>
        </DialogHeader>
        
        <CreateBuyRequestForm onCancel={handleCancel} />
      </DialogContent>
    </Dialog>;
};
export default CreateBuyRequestDialog;