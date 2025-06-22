import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useEditBuyRequest } from '@/hooks/useEditBuyRequest';
import { EditBuyRequestForm } from './edit-buy-request/EditBuyRequestForm';
interface EditBuyRequestDialogProps {
  buyRequestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}
const EditBuyRequestDialog = ({
  buyRequestId,
  open,
  onOpenChange,
  onUpdate
}: EditBuyRequestDialogProps) => {
  const {
    form,
    loading,
    isFetching,
    priceError,
    minPriceInput,
    maxPriceInput,
    handleMinPriceInput,
    handleMaxPriceInput,
    onSubmit
  } = useEditBuyRequest({
    buyRequestId,
    open,
    onSuccess: () => {
      onOpenChange(false);
      onUpdate();
    }
  });
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Publicación</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EditBuyRequestForm control={form.control} minPriceInput={minPriceInput} maxPriceInput={maxPriceInput} priceError={priceError} handleMinPriceInput={handleMinPriceInput} handleMaxPriceInput={handleMaxPriceInput} isFetching={isFetching} />

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading || isFetching}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !!priceError || isFetching}>
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
};
export default EditBuyRequestDialog;