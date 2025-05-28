// src/components/card/donaturs.tsx
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DonaturProps {
  name: string;
  amount: number;
  message: string;
}

// Utility function untuk mendapatkan inisial dari nama
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Donatur: React.FC<DonaturProps> = ({ name, amount, message }) => {
  return (
    <div className="rounded-[20px] shadow-lg overflow-x-auto h-full flex flex-col">
      <div className="bg-[#37977780] p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarFallback className="bg-white text-[#379777] font-bold text-sm">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold !text-black">{name}</h3>
            <p className="font-medium">
              Rp.{amount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 flex-1">
        <p className="text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Donatur;