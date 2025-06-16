// components/program-donation/SearchAndControls.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search,  Plus } from "lucide-react";
import type { SearchAndControlsProps } from '@/types/program';


export const SearchAndControls: React.FC<SearchAndControlsProps> = ({
  searchValue,
  onSearchChange,
  onClearSearch,
  onCreateNew
}) => {
 

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={onClearSearch}
            >
              ×
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 ">
        <Button
        className="flex bg-white text-black shadow-lg hover:bg-gray-100 !px-4 items-center gap-2"
          variant="outline"
          size="sm"
          onClick={onCreateNew}
        >
          <Plus className="h-4 w-4" />
          Create New
        </Button>

      </div>
    </div>
  );
};