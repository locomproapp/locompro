
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useBuyRequestForm } from '@/hooks/useBuyRequestForm';
import { useBuyRequestSubmit } from '@/hooks/useBuyRequestSubmit';
import BuyRequestFormFields from '@/components/BuyRequestDialog/BuyRequestFormFields';
import BuyRequestImageUpload from '@/components/BuyRequestDialog/BuyRequestImageUpload';

const BuyRequestForm = () => {
  const navigate = useNavigate();
  const { formData, handleInputChange, resetForm, setImages } = useBuyRequestForm();
  const { submitBuyRequest, loading } = useBuyRequestSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitBuyRequest(formData);
      resetForm();
      navigate('/my-requests');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BuyRequestFormFields 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <BuyRequestImageUpload 
          images={formData.images}
          setImages={setImages}
        />

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link to="/">Cancelar</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={loading || formData.images.length === 0} 
            className="flex-1"
          >
            {loading ? 'Creando...' : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuyRequestForm;
