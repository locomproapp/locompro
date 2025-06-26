
import React from 'react';
import { Heart, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre LoCompro */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
                alt="LoCompro" 
                className="h-6 w-6"
              />
              <h3 className="text-lg font-semibold text-foreground">LoCompro</h3>
            </div>
            {/* Texto descriptivo eliminado */}
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/locompro.arg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@locompro.arg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.5z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@locomproarg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary">Cómo funciona</a></li>
              <li><a href="/create-buy-request" className="hover:text-primary">Crear publicación</a></li>
              <li><a href="/my-posts" className="hover:text-primary">Mis publicaciones</a></li>
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Vender</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/marketplace" className="hover:text-primary">Ver mercado</a></li>
              <li><a href="/my-offers" className="hover:text-primary">Mis ofertas</a></li>
              <li><a href="#" className="hover:text-primary">Mis chats</a></li>
              <li><a href="#" className="hover:text-primary">Consultas</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-primary">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-primary">Privacidad</a></li>
              <li><a href="#" className="hover:text-primary">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 LoCompro. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-4 md:mt-0">
              Hecho con <Heart className="h-4 w-4 text-red-500" /> en Argentina
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
