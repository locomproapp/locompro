
import React from 'react';
import { Heart, Facebook, Instagram, Twitter } from 'lucide-react';

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
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {/* "Explorar mercado" eliminado */}
              <li><a href="/market" className="hover:text-primary">Crear búsqueda</a></li>
              <li><a href="/my-requests" className="hover:text-primary">Mis solicitudes</a></li>
              <li><a href="#" className="hover:text-primary">Cómo funciona</a></li>
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Vender</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/market" className="hover:text-primary">Ver intereses</a></li>
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

