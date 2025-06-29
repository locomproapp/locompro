
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  mobilePlaceholder?: string;
  value?: string;
}

const SearchBar = ({ onSearch, placeholder = "¿Qué estás buscando?", mobilePlaceholder, value }: SearchBarProps) => {
  // Si se pasa value, controlado desde afuera; si no, local state interno
  const [localSearch, setLocalSearch] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const isControlled = typeof value === 'string';
  const searchQuery = isControlled ? value! : localSearch;

  useEffect(() => {
    const updatePlaceholder = () => {
      if (mobilePlaceholder && window.innerWidth < 768) {
        setCurrentPlaceholder(mobilePlaceholder);
      } else {
        setCurrentPlaceholder(placeholder);
      }
    };

    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, [placeholder, mobilePlaceholder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isControlled) {
      onSearch?.(val);
    } else {
      setLocalSearch(val);
    }
    // Ya no buscamos al tipear (solo onSearch si es controlada la barra)
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder={currentPlaceholder}
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full h-12 pl-4 pr-12 text-lg border-2 border-border focus:border-primary rounded-full shadow-lg placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground"
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
  );
};

export default SearchBar;
