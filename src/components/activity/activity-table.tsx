// components/ActivityTable.tsx
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
import type { Activity, ActivityResponse } from "@/types/activity";
import { ActivityTableRow } from "./activity-table-row";


interface ActivityTableProps {
  activityData: ActivityResponse;
  page: number;
  pageSize: number;
  debouncedSearch: string;
  onViewActivity: (activity: Activity, e?: React.MouseEvent) => void;
  onEditActivity: (activity: Activity, e?: React.MouseEvent) => void;
  onDeleteActivity: (activity: Activity, e?: React.MouseEvent) => void;
}

export const ActivityTable = ({
  activityData,
  page,
  pageSize,
  debouncedSearch,
  onViewActivity,
  onEditActivity,
  onDeleteActivity
}: ActivityTableProps) => {
  const hasActivities = activityData?.data && activityData.data.length > 0;

  return (
    <Table className="rounded-md border">
      <TableCaption>
        {hasActivities 
          ? `List of Activities ${debouncedSearch ? `(filtered by "${debouncedSearch}")` : ''}`
          : 'No activities found'
        }
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">No</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Media</TableHead>
          <TableHead className="w-[80px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hasActivities ? (
          activityData.data.map((activity, index) => (
            <ActivityTableRow
              key={activity.id}
              activity={activity}
              index={index}
              page={page}
              pageSize={pageSize}
              onView={onViewActivity}
              onEdit={onEditActivity}
              onDelete={onDeleteActivity}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              {debouncedSearch 
                ? `No activities found matching "${debouncedSearch}"`
                : "No activities found"
              }
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total Activities</TableCell>
          <TableCell className="text-right">
            {activityData?.pagination?.total_data || 0}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};