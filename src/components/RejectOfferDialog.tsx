
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RejectOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const REJECTION_REASONS = [
  'Precio demasiado alto',
  'No cumple con las especificaciones',
  'Tiempo de entrega muy largo',
  'Falta de información o fotos',
  'Producto en mal estado',
  'Otro motivo'
];

const RejectOfferDialog = ({ open, onOpenChange, onConfirm, isLoading }: RejectOfferDialogProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = async () => {
    const reason = selectedReason === 'Otro motivo' ? customReason : selectedReason;
    if (reason.trim()) {
      try {
        // Call the onConfirm function which should handle the database update
        await onConfirm(reason);
        
        // Reset form state
        setSelectedReason('');
        setCustomReason('');
        
        // Close dialog
        onOpenChange(false);
        
        console.log('Offer rejected with reason:', reason);
      } catch (error) {
        console.error('Error rejecting offer:', error);
        toast({
          title: "Error",
          description: "No se pudo rechazar la oferta. Intenta de nuevo.",
          variant: "destructive"
        });
      }
    }
  };

  const canConfirm = selectedReason && (selectedReason !== 'Otro motivo' || customReason.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-500" />
            Rechazar oferta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecciona el motivo por el cual rechazas esta oferta:
          </p>
          
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {REJECTION_REASONS.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <RadioGroupItem value={reason} id={reason} />
                <Label htmlFor={reason} className="text-sm">{reason}</Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === 'Otro motivo' && (
            <Textarea
              placeholder="Escribe el motivo específico..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="min-h-[80px]"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
          >
            {isLoading ? 'Rechazando...' : 'Rechazar oferta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectOfferDialog;
