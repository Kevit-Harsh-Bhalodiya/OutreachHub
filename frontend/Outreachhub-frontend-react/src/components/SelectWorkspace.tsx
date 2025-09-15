import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkspaceInfo {
  _id: string;
  name: string;
  description: string;
  tags: string[];
}

interface UserWorkspacesTableProps {
  workspaces: WorkspaceInfo[];
  onSelectWorkspace: (workspaceId: string) => void;
}

const getColumns = ({
  onSelectWorkspace,
}: {
  onSelectWorkspace: (workspaceId: string) => void;
}): ColumnDef<WorkspaceInfo>[] => [
  {
    accessorKey: "name",
    header: "Workspace Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-sm">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = (row.getValue("tags") as string[]) || [];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const workspaceId = row.original._id;
      return (
        <div className="text-right">
          <Button size="sm" onClick={() => onSelectWorkspace(workspaceId)}>
            Go to Workspace
          </Button>
        </div>
      );
    },
  },
];

export function SelectWorkspaceTable({
  workspaces,

  onSelectWorkspace,
}: UserWorkspacesTableProps) {
  const columns = React.useMemo(
    () => getColumns({ onSelectWorkspace }),
    [onSelectWorkspace],
  );

  const table = useReactTable({
    data: workspaces || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                This user is not a member of any workspace.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
