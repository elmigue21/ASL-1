"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Subscription } from "@/types/subscription";
import { supabase } from "@/lib/supabase";

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    size: 0,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-black"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    size: 1,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "company_name",
    size: 1,
    header: "Company",

    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("company_name")}</div>
    ),
  },
  {
    accessorKey: "person_country",
    size: 1,
    header: "Country",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("person_country")}</div>
    ),
  },
  {
    accessorKey: "person_industry",
    size: 1,
    header: "Industry",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("person_industry")}</div>
    ),
  },
  {
    accessorKey: "email1",
    size: 1,
    header: "Email",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email1")}</div>
    ),
  },

  {
    id: "actions",
    size: 0,
    enableHiding: false,
    cell: ({ row }) => {
      const subscription = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem
              onClick={() => {
                console.log(subscription.id);
              }}
            >
              View
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function SubscriptionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Default to first page
    pageSize: 5, // Set max rows per page
  });
  const [totalRows, setTotalRows] = useState(0);
  const [maxPageIndex, setMaxPageIndex] = useState(0);

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 5;

  const [subsData, setSubsData] = useState<Subscription[]>([]);

  const fetchSubscriptions = async () => {
    // const start = pagination.pageIndex * pagination.pageSize;
    // const end = start + pagination.pageSize - 1;
    if (subsData.length == 0) {
      const { data: newData, error } = await supabase
        .from("subscriptions")
        .select("*")
        .range(0, pagination.pageSize * 2);
      setSubsData((prevData) => [...prevData, ...(newData || [])]);
    } else {
      const { data: newData, error } = await supabase
        .from("subscriptions")
        .select("*")
        .range(subsData?.length, subsData.length + pagination.pageSize);
      setSubsData((prevData) => [...prevData, ...(newData || [])]);
    }
  };

  const [addSubsLoading, setAddSubsLoading] = useState(false);
  const addSubs = async () => {
    if (addSubsLoading) {
      return;
    }
    setAddSubsLoading(true);
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .range(subsData?.length, subsData?.length + 5);
    setSubsData((prevData) => [...prevData, ...(data ?? [])]);
    setAddSubsLoading(false);
  };
  const [searchValue, setSearchValue] = useState("");
  const [searchNameLoading, setSearchNameLoading] = useState(false);
  const searchName = async () => {
    if (searchNameLoading) {
      return;
    }
    setSearchNameLoading(true);

    let query = supabase
      .from("subscriptions")
      .select("*")
      .range(0, 5);

  if (searchValue && searchValue !== "") {
    query = query.ilike("full_name", `%${searchValue}%`);
  }

    const { data, error } = await query;
    console.log(data);
    setSubsData(data || []);
    setSearchNameLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const table = useReactTable({
    data: subsData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
  });

  const getAllSelectedRows = () => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  };

  useEffect(() => {
    if (!table.getCanNextPage()) {
      console.log("CANT NEXT PAGE");
      const fetchMoreData = async () => {};
    }
  }, [table.getState().pagination]);

  return (
    <div className="w-full">
      <Button
        onClick={() => {
          addSubs();
        }}
      ></Button>
      <Button
        onClick={() => {
          console.log(pagination.pageIndex);
        }}
      >
        log pagination
      </Button>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name..."
          value={
            searchValue
          }
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={()=>{searchName()}}>Search</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="table-fixed w-full border-collapse border border-gray-300">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={` 
                        ${
                          index === 0 ||
                          index === headerGroup.headers.length - 1
                            ? "w-[50px]"
                            : "flex-grow basis-0 text-bold"
                        } 
                        `}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="truncate overflow-hidden whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <Button
        onClick={() => {
          addSubs();
        }}
        className="hover:cursor-pointer"
      >
        LOAD MORE
      </Button>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {totalRows}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
