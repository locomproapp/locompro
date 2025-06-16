
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateUserPostForm from './CreateUserPostForm';
import { useCreateUserPost } from './useCreateUserPost';

interface CreateUserPostDialogProps {
  onPostCreated?: () => void;
}

const CreateUserPostDialog = ({ onPostCreated }: CreateUserPostDialogProps) => {
  const [open, setOpen] = useState(false);
  const {
    form,
    loading,
    priceError,
    minPriceInput,
    maxPriceInput,
    handleMinPriceInput,
    handleMaxPriceInput,
    handleSubmit,
    resetForm,
  } = useCreateUserPost(onPostCreated);

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const handleFormSubmit = async (values: any) => {
    await handleSubmit(values);
    setOpen(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => { 
        setOpen(value); 
        if (!value) { 
          resetForm(); 
        } 
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear Publicación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Publicación</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <CreateUserPostForm
            control={form.control}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            priceError={priceError}
            handleMinPriceInput={handleMinPriceInput}
            handleMaxPriceInput={handleMaxPriceInput}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserPostDialog;
