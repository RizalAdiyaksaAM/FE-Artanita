// components/user/user-table.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User, UserResponse } from "@/types/user";
import { UserTableRow } from "./user-table-row";


interface UserTableProps {
  userData: UserResponse;
  page: number;
  pageSize: number;
  debouncedSearch: string;
  onViewUser: (user: User, e?: React.MouseEvent) => void;
  onEditUser: (user: User, e?: React.MouseEvent) => void;
  onDeleteUser: (user: User, e?: React.MouseEvent) => void;
}

export const UserTable = ({
  userData,
  page,
  pageSize,
  debouncedSearch,
  onViewUser,
  onEditUser,
  onDeleteUser
}: UserTableProps) => {
  const hasUsers = userData?.data && userData.data.length > 0;

  return (
    <Table className="rounded-md border">
      <TableCaption>
        {hasUsers 
          ? `List of Users ${debouncedSearch ? `(filtered by "${debouncedSearch}")` : ''}`
          : 'No users found'
        }
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">No</TableHead>
          <TableHead>Photo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Education</TableHead>
          <TableHead>Position</TableHead>
          <TableHead className="w-[80px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hasUsers ? (
          userData.data.map((user, index) => (
            <UserTableRow
              key={user.id}
              user={user}
              index={index}
              page={page}
              pageSize={pageSize}
              onView={onViewUser}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              {debouncedSearch 
                ? `No users found matching "${debouncedSearch}"`
                : "No users found"
              }
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>Total Users</TableCell>
          <TableCell className="text-right">
            {userData?.pagination?.total_data || 0}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};