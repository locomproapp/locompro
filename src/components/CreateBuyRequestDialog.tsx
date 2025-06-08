
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBuyRequestForm } from '@/hooks/useBuyRequestForm';
import { useBuyRequestSubmit } from '@/hooks/useBuyRequestSubmit';
import BuyRequestFormFields from './BuyRequestDialog/BuyRequestFormFields';
import BuyRequestImageUpload from './BuyRequestDialog/BuyRequestImageUpload';

interface CreateBuyRequestDialogProps {
  onRequestCreated?: () => void;
}

const CreateBuyRequestDialog = ({ onRequestCreated }: CreateBuyRequestDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { formData, handleInputChange, resetForm, setImages } = useBuyRequestForm();
  const { submitBuyRequest, loading } = useBuyRequestSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitBuyRequest(formData);
      resetForm();
      setOpen(false);
      onRequestCreated?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          ¿Qué Buscás?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Solicitud de Compra</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <BuyRequestFormFields 
            formData={formData}
            onInputChange={handleInputChange}
          />

          <BuyRequestImageUpload 
            images={formData.images}
            setImages={setImages}
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || formData.images.length === 0 || !user} 
              className="flex-1"
            >
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBuyRequestDialog;
