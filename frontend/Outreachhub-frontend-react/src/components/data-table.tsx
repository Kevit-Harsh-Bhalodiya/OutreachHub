import * as React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosInstance } from "@/pages/auth/Login";
import type { RootState } from "@/redux/store";
import type { User, Contact } from "@/types";

// --- Data Structure Definitions ---

interface UserDisplayData {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  contactsCreated: number;
  workspaceCount: number; // New property for the count
  workspaceNames: string[]; // New property for the names
}
interface WorkspaceUser {
  userId: string;
  workspaces: {
    _id: string;
    name: string;
  }[];
}

interface UsersDataTableProps {
  users: User[];
  contacts: Contact[];
  workspaceUser: WorkspaceUser[];
}

export function DataTable({
  users = [],
  contacts = [],
  workspaceUser = [],
}: UsersDataTableProps) {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigator = useNavigate();
  const location = useLocation();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "contactsCreated", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // --- Action Handlers ---

  const handleEdit = (userId: string) => {
    navigator(`/admin/editUser/${userId}`, { state: { from: location } });
  };
  const handleAddToWorkspace = (userId: string) => {
    navigator(`/admin/addUserToWorkspace/${userId}`, {
      state: { from: location },
    });
  };
  const handleRemoveFromWorkspace = (userId: string) => {
    navigator(`/admin/removeUserFromWorkspace/${userId}`, {
      state: { from: location },
    });
  };
  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const response = await axiosInstance.delete(`/user/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert("User deleted successfully");
        window.location.reload();
      } else {
        alert("Error deleting user");
      }
    }
  };

  // --- Column Definitions ---

  const getColumns = React.useCallback(
    (): ColumnDef<UserDisplayData>[] => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      // --- TASK 1 & 2: New 'Workspaces' Column with Tooltip ---
      {
        accessorKey: "workspaceCount",
        header: () => <div className="text-center">Workspaces</div>,
        cell: ({ row }) => {
          const count = row.getValue("workspaceCount") as number;
          const names = row.original.workspaceNames;

          return (
            <div className="text-center font-medium">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={count > 0 ? "secondary" : "outline"}>
                      {count}
                    </Badge>
                  </TooltipTrigger>
                  {count > 0 && (
                    <TooltipContent>
                      <div className="flex flex-col gap-1 p-1">
                        {names.map((name) => (
                          <p key={name}>{name}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      },
      {
        accessorKey: "contactsCreated",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Contacts Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {row.getValue("contactsCreated")}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.email)}
                >
                  Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleAddToWorkspace(user._id)}
                >
                  Add to Workspace
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRemoveFromWorkspace(user._id)}
                >
                  Remove from Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(user._id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [navigator, token],
  );

  const columns = React.useMemo(() => getColumns(), [getColumns]);

  // --- Data Processing ---

  const processedData = React.useMemo(() => {
    const contactsCountMap = new Map<string, number>();
    for (const contact of contacts) {
      if (contact.creator) {
        contactsCountMap.set(
          contact.creator,
          (contactsCountMap.get(contact.creator) || 0) + 1,
        );
      }
    }

    // Create a map of userId to their workspace data
    const userWorkspaceMap = new Map<string, { count: number; names: string[] }>();
    for (const wsUser of workspaceUser) {
      userWorkspaceMap.set(wsUser.userId, {
        count: wsUser.workspaces.length,
        names: wsUser.workspaces.map((ws) => ws.name),
      });
    }

    return users.map(
      (user): UserDisplayData => ({
        _id: user._id,
        name: user.name,
        email: user.contactInfo.email,
        phoneNo: `${user.contactInfo.countryCode} ${user.contactInfo.phoneNo}`,
        contactsCreated: contactsCountMap.get(user._id) || 0,
        // Get workspace data from the map
        workspaceCount: userWorkspaceMap.get(user._id)?.count || 0,
        workspaceNames: userWorkspaceMap.get(user._id)?.names || [],
      }),
    );
  }, [users, contacts, workspaceUser]);

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full flex-col justify-start gap-6 space-y-4">
      <div className="flex items-center ">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          className="mx-3"
          onClick={() => {
            navigator("/admin/createUser", { state: { from: location } });
          }}
        >
          New User
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {table.getFilteredRowModel().rows.length} user(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
