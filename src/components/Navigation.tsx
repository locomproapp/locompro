
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProfileDialog from './ProfileDialog';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer" 
              onClick={() => navigate('/')}
            >
              LoCompro
            </h1>
          </div>
          
          {/* Navigation buttons */}
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
