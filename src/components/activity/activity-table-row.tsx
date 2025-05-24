// components/ActivityTableRow.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { Activity } from "@/types/activity";
import { formatDateTime, truncateText } from "@/utils/activity";
import { MediaPreview } from "./media-previews";


interface ActivityTableRowProps {
  activity: Activity;
  index: number;
  page: number;
  pageSize: number;
  onView: (activity: Activity, e?: React.MouseEvent) => void;
  onEdit: (activity: Activity, e?: React.MouseEvent) => void;
  onDelete: (activity: Activity, e?: React.MouseEvent) => void;
}

export const ActivityTableRow = ({
  activity,
  index,
  page,
  pageSize,
  onView,
  onEdit,
  onDelete
}: ActivityTableRowProps) => {
  return (
    <TableRow 
      key={activity.id} 
      className="cursor-pointer hover:bg-gray-50"
      onClick={(e) => onView(activity, e)}
    >
      <TableCell className="font-medium">
        {(page - 1) * pageSize + index + 1}
      </TableCell>
      <TableCell>{activity.title}</TableCell>
      <TableCell>{truncateText(activity.description)}</TableCell>
      <TableCell>{activity.location}</TableCell>
      <TableCell>{formatDateTime(activity.time)}</TableCell>
      <TableCell>
        <MediaPreview activity={activity} />
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
            <DropdownMenuItem onClick={(e) => onView(activity, e)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => onEdit(activity, e)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => onDelete(activity, e)}
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