
import React from 'react';

interface SearchResultsHeaderProps {
  count: number;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ count }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {count} {count === 1 ? 'publicación' : 'publicaciones'}
      </p>
    </div>
  );
};

export default SearchResultsHeader;
