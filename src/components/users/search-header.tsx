// components/user/search-header-user.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, X } from "lucide-react";

interface SearchHeaderUserProps {
  searchInput: string;
  debouncedSearch: string;
  filters: {
    address: string;
    age: string;
    education: string;
    position: string;
  };
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  onCreateUser: () => void;
    // Dynamic options
  positionOptions?: string[];
  educationOptions?: string[];
}
export const SearchHeaderUser = ({
  searchInput,
  debouncedSearch,
  filters,
  onSearchChange,
  onClearSearch,
  onFilterChange,
  onClearFilters,
  onCreateUser,
  positionOptions = ["Pengurus", "Anak Asuh",],
  educationOptions = ["SD", "SMP", "SMA", ],
}: SearchHeaderUserProps) => {
  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "").length;
  const hasActiveFilters = activeFilterCount > 0 || searchInput;

  return (
    <div className="space-y-4">
      {/* Search Bar and Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name..."
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

        <Button
          onClick={onCreateUser}
          className="flex bg-white text-black shadow-lg hover:bg-gray-100 !px-4 items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {debouncedSearch && (
        <div className="text-sm text-muted-foreground">
          Searching for: "{debouncedSearch}"
        </div>
      )}

      {/* Filter Inputs - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            placeholder="Filter by address"
            value={filters.address}
            onChange={(e) => onFilterChange("address", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Age</label>
          <Select
            value={filters.age || "all"}
            onValueChange={(value) => onFilterChange("age", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="0-10">0-10 years</SelectItem>
              <SelectItem value="11-15">11-15 years</SelectItem>
              <SelectItem value="16-20">16-20 years</SelectItem>
              <SelectItem value="21+">21+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Education</label>
          <Select
            value={filters.education || "all"}
            onValueChange={(value) => onFilterChange("education", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Education</SelectItem>
              {educationOptions.map((edu) => (
                <SelectItem key={edu} value={edu}>
                  {edu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Position</label>
          <Select
            value={filters.position || "all"}
            onValueChange={(value) => onFilterChange("position", value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positionOptions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="md:col-span-4 flex justify-end">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};