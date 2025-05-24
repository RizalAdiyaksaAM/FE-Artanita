// components/program-donation/ProgramTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { ProgramTableProps } from '@/types/program';


export const ProgramTable: React.FC<ProgramTableProps> = ({
  programs,
  onView,
  onEdit,
  onDelete
}) => {
  const truncateText = (text?: string, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'Rp0';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Table className="rounded-md border">
      <TableCaption>List of Donation Programs</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">No</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Goal Amount</TableHead>
          <TableHead className="text-right">Current Amount</TableHead>
          <TableHead className="w-[80px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((program) => (
          <TableRow 
            key={program.id} 
            className="cursor-pointer hover:bg-gray-50"
            onClick={(e) => onView(program)}
          >
            <TableCell className="font-medium">{program.number}</TableCell>
            <TableCell>{program.title}</TableCell>
            <TableCell>{truncateText(program.deskripsi)}</TableCell>
            <TableCell>
              {program.program_donation_images && program.program_donation_images.length > 0 && (
                <img 
                  className="h-12 w-16 rounded-lg object-cover" 
                  src={program.program_donation_images[0].image_url} 
                  alt={program.title} 
                />
              )}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(program.goal_amount)}</TableCell>
            <TableCell className="text-right">{formatCurrency(program.current_amount)}</TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onView(program);
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(program);
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(program);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};