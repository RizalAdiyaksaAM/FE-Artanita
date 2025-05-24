// components/program-donation/SearchAndControls.tsx
import React, { useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     onImportCSV(file);
  //   }
  // };

  // const downloadSampleCSV = () => {
  //   const sampleData = [
  //     'title,deskripsi,goal_amount,image_url',
  //     'Sample Program 1,This is a sample donation program,1000000,https://example.com/image1.jpg',
  //     'Sample Program 2,Another sample donation program,2000000,https://example.com/image2.jpg'
  //   ].join('\n');

  //   const blob = new Blob([sampleData], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'sample_program_donations.csv';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

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