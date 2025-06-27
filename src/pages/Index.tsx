
import React, { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Search, Package, Handshake, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);

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

  const handleHowItWorksToggle = (open: boolean) => {
    setIsHowItWorksOpen(open);
    
    if (open && howItWorksRef.current) {
      // Small delay to allow the content to render
      setTimeout(() => {
        if (howItWorksRef.current) {
          const rect = howItWorksRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const elementHeight = rect.height;
          const scrollTop = window.pageYOffset + rect.top - (viewportHeight - elementHeight) / 2;
          
          window.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }
      }, 200);
    } else if (!open) {
      // Scroll to top when closing
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full flex-1">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground" style={{
            fontFamily: 'inherit',
            letterSpacing: '0em',
            fontWeight: 500,
            color: 'inherit'
          }}>
            LoCompro
          </h1>
          {/* Desktop subheader */}
          <p className="text-xl text-muted-foreground mb-6 sm:mb-8 mt-4 sm:mt-7 max-w-3xl mx-auto hidden sm:block">
            La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas.
          </p>
          {/* Mobile subheader */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 mt-4 sm:mt-7 max-w-3xl mx-auto block sm:hidden">
            Donde los compradores dicen qué buscan y los vendedores ofrecen.
          </p>
          <div className="mb-6 sm:mb-10 flex justify-center">
            <div className="w-full max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Producto que quieras vender"
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="w-full h-12 pl-4 pr-12 text-lg border-2 border-border focus:border-primary rounded-full sm:rounded-full rounded-lg shadow-lg placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4 justify-center mb-8 sm:mb-12 px-2">
            <Button asChild size="sm" className="text-base sm:text-lg px-8 py-6 sm:px-8 sm:py-6 flex-1 sm:flex-none max-w-[180px] sm:max-w-none">
              <Link to="/marketplace">
                <ShoppingBag className="mr-2 sm:mr-2 h-6 w-6 sm:h-5 sm:w-5" />
                <span className="text-base sm:text-lg block sm:hidden">Mercado</span>
                <span className="text-base sm:text-lg hidden sm:block">Explorar Mercado</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="text-base sm:text-lg px-8 py-6 sm:px-8 sm:py-6 flex-1 sm:flex-none max-w-[180px] sm:max-w-none">
              <Link to="/create-buy-request" state={{
                from: "/"
              }}>
                <Plus className="mr-2 sm:mr-2 h-6 w-6 sm:h-5 sm:w-5" />
                <span className="text-base sm:text-lg">Crear Búsqueda</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile collapsible section */}
        <div className="block md:hidden mb-8" style={{ minHeight: 'calc(100vh - 600px)' }}>
          <Collapsible open={isHowItWorksOpen} onOpenChange={handleHowItWorksToggle}>
            <CollapsibleTrigger asChild>
              <div className="bg-white rounded-lg shadow-sm border border-border p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">¿Cómo Funciona?</h3>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isHowItWorksOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent ref={howItWorksRef}>
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Publicá el producto que buscás</h3>
                      <p className="text-sm text-muted-foreground">Describí que buscás, con características, tu presupuesto y de dónde sos.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Recibí ofertas</h3>
                      <p className="text-sm text-muted-foreground">La gente que tenga lo que buscás te lo va a ofrecer.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Handshake className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Elegí la mejor</h3>
                      <p className="text-sm text-muted-foreground">Compará las ofertas y quedate con la que más te sirva.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Desktop section - unchanged */}
        <div className="hidden md:grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Publicá el producto que buscás</h3>
            <p className="text-muted-foreground">Describí que buscás, con características, tu presupuesto y de dónde sos.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Recibí ofertas</h3>
            <p className="text-muted-foreground">
              La gente que tenga lo que buscás te lo va a ofrecer.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Elegí la mejor</h3>
            <p className="text-muted-foreground">
              Compará las ofertas y quedate con la que más te sirva.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
