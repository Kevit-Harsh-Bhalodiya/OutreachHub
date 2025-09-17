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
import { Checkbox } from "@/components/ui/checkbox";

// 1. DATA TYPES AND PROPS
interface Workspace {
  _id: string; // CHANGED from 'id'
  name: string;
  tags: string[];
}
interface Permissions {
  write: boolean;
  allowAdd: boolean;
}

interface AddToWorkspaceTableProps {
  workspaces: Workspace[];
  userId: string;
  // onAddUser: (details: {
  //   userId: string;
  //   workspaceId: string;
  //   permissions: { write: boolean; allowAdd: boolean };
  // }) => void;
  onAddUser: (data: {
    userId: string;
    workspaceId: string;
    permissions: Permissions;
  }) => void;
}

type PermissionState = {
  [workspaceId: string]: {
    write: boolean;
    allowAdd: boolean;
  };
};

// 2. COLUMN DEFINITIONS (as a function to accept handlers)
const getColumns = ({
  permissions,
  handlePermissionChange,
  handleSubmit,
}: {
  permissions: PermissionState;
  handlePermissionChange: (
    workspaceId: string,
    permissionType: "write" | "allowAdd",
    value: boolean,
  ) => void;
  handleSubmit: (workspaceId: string) => void;
}): ColumnDef<Workspace>[] => [
  {
    accessorKey: "name",
    header: "Workspace Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
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
    id: "write",
    header: () => <div className="text-center">Write Permission</div>,
    cell: ({ row }) => {
      const workspaceId = row.original._id; // CHANGED from .id
      const isChecked = permissions[workspaceId]?.write || false;

      return (
        <div className="text-center">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) =>
              handlePermissionChange(workspaceId, "write", !!value)
            }
            aria-label="Write permission"
          />
        </div>
      );
    },
  },
  {
    id: "allowAdd",
    header: () => <div className="text-center">Allow Add Users</div>,
    cell: ({ row }) => {
      const workspaceId = row.original._id; // CHANGED from .id
      const isChecked = permissions[workspaceId]?.allowAdd || false;

      return (
        <div className="text-center">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) =>
              handlePermissionChange(workspaceId, "allowAdd", !!value)
            }
            aria-label="Allow add users permission"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const workspaceId = row.original._id; // CHANGED from .id
      return (
        <div className="text-right">
          <Button size="sm" onClick={() => handleSubmit(workspaceId)}>
            Add to Workspace
          </Button>
        </div>
      );
    },
  },
];

// 3. THE MAIN DATA TABLE COMPONENT
export function AddToWorkspaceTable({
  workspaces,
  userId,
  onAddUser,
}: AddToWorkspaceTableProps) {
  const [permissions, setPermissions] = React.useState<PermissionState>({});

  const handlePermissionChange = (
    workspaceId: string,
    permissionType: "write" | "allowAdd",
    value: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [workspaceId]: {
        ...prev[workspaceId],
        [permissionType]: value,
      },
    }));
  };

  const handleSubmit = (workspaceId: string) => {
    const currentPermissions = {
      write: permissions[workspaceId]?.write || false,
      allowAdd: permissions[workspaceId]?.allowAdd || false,
    };

    onAddUser({
      userId,
      workspaceId,
      permissions: currentPermissions,
    });
  };

  const columns = React.useMemo(
    () => getColumns({ permissions, handlePermissionChange, handleSubmit }),
    [permissions, handlePermissionChange, handleSubmit], // Added handlers to dependency array for correctness
  );

  const table = useReactTable({
    data: workspaces || [], // Added a fallback for safety
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No workspaces available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
