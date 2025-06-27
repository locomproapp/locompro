
import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center mb-6 sm:mb-16 mt-4 sm:mt-16">
      <div className="flex items-center justify-center mb-4 sm:mb-9">
        <img 
          src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
          alt="LoCompro" 
          className="h-10 w-10 sm:h-16 sm:w-16 object-contain mr-2 sm:mr-4"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-3xl md:text-6xl font-medium tracking-tight text-foreground" style={{
          fontFamily: 'inherit',
          letterSpacing: '0em',
          fontWeight: 500,
          color: 'inherit'
        }}>
          LoCompro
        </h1>
      </div>
      {/* Desktop subheader */}
      <p className="text-xl text-muted-foreground mb-4 sm:mb-8 mt-6 sm:mt-16 max-w-3xl mx-auto hidden sm:block">
        La plataforma donde los compradores publican qué buscan y los vendedores envían ofertas.
      </p>
      {/* Mobile subheader */}
      <p className="text-base sm:text-xl text-muted-foreground mb-4 sm:mb-8 mt-4 sm:mt-11 max-w-3xl mx-auto block sm:hidden">
        Donde los compradores dicen qué buscan y los vendedores ofrecen.
      </p>
    </div>
  );
};

export default HeroSection;
