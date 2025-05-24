// components/user/user-table-row.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { User } from "@/types/user";


interface UserTableRowProps {
  user: User;
  index: number;
  page: number;
  pageSize: number;
  onView: (user: User, e?: React.MouseEvent) => void;
  onEdit: (user: User, e?: React.MouseEvent) => void;
  onDelete: (user: User, e?: React.MouseEvent) => void;
}

export const UserTableRow = ({
  user,
  index,
  page,
  pageSize,
  onView,
  onEdit,
  onDelete
}: UserTableRowProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <TableRow 
      key={user.id} 
      className="cursor-pointer hover:bg-gray-50"
      onClick={(e) => onView(user, e)}
    >
      <TableCell className="font-medium">
        {(page - 1) * pageSize + index + 1}
      </TableCell>
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.address}</TableCell>
      <TableCell>{user.age} years</TableCell>
      <TableCell>{user.education}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.position === 'Anak Asuh' ? 'bg-blue-100 text-blue-800' :
          user.position === 'Anak Panti' ? 'bg-green-100 text-green-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {user.position}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => onView(user, e)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => onEdit(user, e)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => onDelete(user, e)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
