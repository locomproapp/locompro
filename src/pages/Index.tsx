
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/Home/HeroSection';
import SearchSection from '@/components/Home/SearchSection';
import HowItWorksSection from '@/components/Home/HowItWorksSection';
import DesktopFeatures from '@/components/Home/DesktopFeatures';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (query && query.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full flex-1">
        <HeroSection />
        
        <SearchSection 
          searchQuery={searchQuery}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        <HowItWorksSection 
          isOpen={isHowItWorksOpen}
          onToggle={setIsHowItWorksOpen}
        />

        <DesktopFeatures />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
