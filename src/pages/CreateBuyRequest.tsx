
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/CreateBuyRequest/PageHeader';
import BuyRequestForm from '@/components/CreateBuyRequest/BuyRequestForm';
import { useLocation } from 'react-router-dom';

const CreateBuyRequest = () => {
  const location = useLocation();
  // Fallback to home if not specified
  const from = location.state?.from === "/marketplace" ? "/marketplace" : "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BuyRequestForm from={from} />
      </main>

      <Footer />
    </div>
  );
};

export default CreateBuyRequest;
