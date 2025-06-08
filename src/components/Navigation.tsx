
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProfileDialog from './ProfileDialog';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleNavigate('/')}
            >
              <img 
                src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
                alt="LoCompro" 
                className="h-8 w-8"
              />
              <h1 className="text-2xl font-bold text-primary">
                LoCompro
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => navigate('/')}
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary"
                onClick={() => navigate('/market')}
              >
                Mercado
              </Button>
              
              {user && (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-primary"
                    onClick={() => navigate('/my-requests')}
                  >
                    Mis Solicitudes
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-foreground hover:text-primary"
                    onClick={() => navigate('/my-offers')}
                  >
                    Mis Ofertas
                  </Button>
                </>
              )}
              
              {user && <ProfileDialog />}
              
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleAuthClick}
              >
                {user ? 'Cerrar sesión' : 'Login / Register'}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              {user && <ProfileDialog />}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground hover:text-primary"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="pb-4 border-t border-border mt-4">
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                variant="ghost" 
                className="justify-start text-foreground hover:text-primary"
                onClick={() => handleNavigate('/')}
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start text-foreground hover:text-primary"
                onClick={() => handleNavigate('/market')}
              >
                Mercado
              </Button>
              
              {user && (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-foreground hover:text-primary"
                    onClick={() => handleNavigate('/my-requests')}
                  >
                    Mis Solicitudes
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-foreground hover:text-primary"
                    onClick={() => handleNavigate('/my-offers')}
                  >
                    Mis Ofertas
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline" 
                className="justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-4"
                onClick={handleAuthClick}
              >
                {user ? 'Cerrar sesión' : 'Login / Register'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
