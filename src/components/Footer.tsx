
import React from 'react';
import { Heart, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre LoCompro */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">LoCompro</h3>
            <p className="text-muted-foreground text-sm mb-4">
              La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas.
            </p>
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
              <li><a href="/market" className="hover:text-primary">Explorar mercado</a></li>
              <li><a href="/market" className="hover:text-primary">Crear solicitud</a></li>
              <li><a href="/my-requests" className="hover:text-primary">Mis solicitudes</a></li>
              <li><a href="#" className="hover:text-primary">Cómo funciona</a></li>
            </ul>
          </div>

          {/* Vender */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Vender</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/market" className="hover:text-primary">Ver solicitudes</a></li>
              <li><a href="/my-offers" className="hover:text-primary">Mis ofertas</a></li>
              <li><a href="#" className="hover:text-primary">Consejos para vender</a></li>
              <li><a href="#" className="hover:text-primary">Tarifas</a></li>
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
              © 2024 LoCompro. Todos los derechos reservados.
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
