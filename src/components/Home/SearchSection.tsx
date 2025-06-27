
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchSectionProps {
  searchQuery: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchSection = ({ searchQuery, onInputChange, onSubmit }: SearchSectionProps) => {
  return (
    <>
      <div className="mb-4 sm:mb-10 mt-6 sm:mt-8 flex justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Producto que quieras vender"
                value={searchQuery}
                onChange={onInputChange}
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
      <div className="flex flex-row gap-2 sm:gap-4 justify-center mb-4 mt-6 sm:mt-12 px-0 sm:px-2">
        <Button asChild size="sm" className="text-base sm:text-lg px-4 py-6 sm:px-8 sm:py-6 flex-1 sm:flex-none max-w-[160px] sm:max-w-none">
          <Link to="/marketplace">
            <ShoppingBag className="mr-2 sm:mr-2 h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg block sm:hidden">Mercado</span>
            <span className="text-base sm:text-lg hidden sm:block">Explorar Mercado</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="text-base sm:text-lg px-4 py-6 sm:px-8 sm:py-6 flex-1 sm:flex-none max-w-[160px] sm:max-w-none">
          <Link to="/create-buy-request" state={{
            from: "/"
          }}>
            <Plus className="mr-1 sm:mr-2 h-6 w-6 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg">Crear Búsqueda</span>
          </Link>
        </Button>
      </div>
    </>
  );
};

export default SearchSection;
