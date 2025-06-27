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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Mobile Layout - Full height main content */}
        <div className="flex-1 flex flex-col justify-center py-8 sm:py-16 md:hidden min-h-[calc(100vh-3.5rem)]">
          {/* Hero Section with spacing */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium tracking-tight text-foreground mb-6" style={{
              fontFamily: 'inherit',
              letterSpacing: '0em',
              fontWeight: 500,
              color: 'inherit'
            }}>
              LoCompro
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Donde los compradores dicen qué buscan y los vendedores ofrecen.
            </p>
          </div>

          {/* Search Section with spacing */}
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <div className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Producto que quieras vender"
                      value={searchQuery}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-4 pr-12 text-lg border-2 border-border focus:border-primary rounded-lg shadow-lg placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center"
                    >
                      <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="flex flex-row gap-2 justify-center px-2">
              <button className="text-base px-8 py-6 flex-1 max-w-[180px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center justify-center font-medium transition-colors">
                <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mercado
              </button>
              <button className="text-base px-8 py-6 flex-1 max-w-[180px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center justify-center font-medium transition-colors">
                <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Búsqueda
              </button>
            </div>
          </div>

          {/* How It Works Section with spacing */}
          <div className="mt-auto">
            <HowItWorksSection 
              isOpen={isHowItWorksOpen}
              onToggle={setIsHowItWorksOpen}
            />
          </div>
        </div>

        {/* Desktop Layout - Keep existing */}
        <div className="hidden md:block py-8 sm:py-16">
          <HeroSection />
          
          <SearchSection 
            searchQuery={searchQuery}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />

          <DesktopFeatures />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
