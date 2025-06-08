
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/CreateBuyRequest/PageHeader';
import BuyRequestForm from '@/components/CreateBuyRequest/BuyRequestForm';

const CreateBuyRequest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader />
        <BuyRequestForm />
      </main>

      <Footer />
    </div>
  );
};

export default CreateBuyRequest;
