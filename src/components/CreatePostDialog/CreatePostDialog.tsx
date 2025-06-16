
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePostForm from './CreatePostForm';
import { useCreatePostForm } from './useCreatePostForm';
import { CreatePostDialogProps } from './types';

const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
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
    watchedValues
  } = useCreatePostForm(onPostCreated);

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
        
        <CreatePostForm
          form={form}
          loading={loading}
          priceError={priceError}
          minPriceInput={minPriceInput}
          maxPriceInput={maxPriceInput}
          onMinPriceInput={handleMinPriceInput}
          onMaxPriceInput={handleMaxPriceInput}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          watchedValues={watchedValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
