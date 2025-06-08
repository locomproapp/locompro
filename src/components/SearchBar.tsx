
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Search functionality will be implemented later
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="¿Qué estás buscando?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-4 pr-12 text-lg border-2 border-border focus:border-primary rounded-full shadow-lg"
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
