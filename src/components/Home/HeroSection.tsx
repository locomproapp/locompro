
import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center mb-8 sm:mb-16 mt-24">
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
    </div>
  );
};

export default HeroSection;
