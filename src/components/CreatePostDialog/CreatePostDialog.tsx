
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from './CreatePostForm';
import { useCreatePostForm } from './useCreatePostForm';
import { CreatePostDialogProps } from './types';

const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  } = useCreatePostForm(onPostCreated);

  const handleOpenDialog = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setOpen(true);
  };

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
        <Button className="flex items-center gap-2" onClick={handleOpenDialog}>
          <Plus className="h-4 w-4" />
          Crear Publicación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Publicación</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <CreatePostForm
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

export default CreatePostDialog;
