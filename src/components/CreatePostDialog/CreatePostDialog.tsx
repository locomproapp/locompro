
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
    formData,
    loading,
    touched,
    showMaxPriceError,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    resetForm
  } = useCreatePostForm(onPostCreated);

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
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
          formData={formData}
          loading={loading}
          touched={touched}
          showMaxPriceError={showMaxPriceError}
          onInputChange={handleInputChange}
          onImagesChange={handleImagesChange}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
