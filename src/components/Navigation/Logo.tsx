
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <div className="mr-4 hidden md:flex items-center" style={{gap: 0, height: '2.5rem'}}>
      <Link to="/" className="flex items-center" style={{height: '2.5rem'}}>
        <img 
          src="/lovable-uploads/0fb22d35-f8de-48a5-89c9-00c4749e4881.png" 
          alt="LoCompro" 
          className="h-8 w-8 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      </Link>
      {/* New: Inicio link */}
      <Button
        asChild
        variant="ghost"
        className="ml-4 capitalize"
      >
        <Link to="/">Inicio</Link>
      </Button>
      {/* Mercado button remains as before, now to the right of Inicio */}
      <Button
        asChild
        variant="ghost"
        className="ml-2 capitalize"
      >
        <Link to="/marketplace">Mercado</Link>
      </Button>
    </div>
  );
}
