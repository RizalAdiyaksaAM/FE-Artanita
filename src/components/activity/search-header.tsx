// components/SearchHeader.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface SearchHeaderProps {
  searchInput: string;
  debouncedSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onCreateActivity: () => void;
}

export const SearchHeader = ({
  searchInput,
  debouncedSearch,
  onSearchChange,
  onClearSearch,
  onCreateActivity
}: SearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchInput}
            onChange={onSearchChange}
            className="pl-8"
          />
          {searchInput && (
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
        {debouncedSearch && (
          <div className="text-sm text-muted-foreground">
            Searching for: "{debouncedSearch}"
          </div>
        )}
      </div>
      
      <Button onClick={onCreateActivity} className="flex bg-white text-black shadow-lg hover:bg-gray-100 !px-4 items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Activity
      </Button>
    </div>
  );
};