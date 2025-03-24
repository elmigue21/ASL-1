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

import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  addSelectedSubscription,
  removeSelectedSubscription,
} from "@/store/slices/subscriptionSlice";
import { useQuery,keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';


interface PaginatedSubscription extends Subscription {
  page: number; // Add the page field
}

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
    pageSize: 10, // Set max rows per page
  });

  const [subsData, setSubsData] = useState<PaginatedSubscription[]>([]);
  const [pages, setPages] = useState([]);
  const dispatch = useDispatch();
  const selectedSubscriptionIds = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedSubscriptionIds
  );

  const fetchSubscriptions = async () => {
    
    if(subsData.some(subscription => subscription.page === pagination.pageIndex)){
        return subsData.filter(subscription => subscription.page === pagination.pageIndex)
    }

    const start = (pagination.pageIndex + 1) * pagination.pageSize;
    const end = ((pagination.pageIndex + 1) * pagination.pageSize) + pagination.pageSize -1;
    const {data, error} = await supabase.from('subscriptions').select("*").range(start,end);

        if (error) {
          console.error(error);
          return;
        }
            const updatedData = data.map((subscription) => ({
              ...subscription,
              page: pagination.pageIndex, // Add page property to each subscription
            }));

        setSubsData((prevData) =>[...prevData, ...updatedData])
  };

const fetchSubscriptions2 = async () => {
  // Pagination calculation
  const pageSize = 10; // or dynamically set based on your need
  const start = pagination.pageIndex * pageSize;
  const end = (pagination.pageIndex + 1) * pageSize - 1;

  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const [page, setPage] = useState(0);

  const { data, fetchNextPage, hasNextPage, isLoading,fetchPreviousPage } = useInfiniteQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions2,
    initialPageParam: 1, // Starting with the first page
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      // Example: If the last page has less than 10 items, it's the last page
      return lastPage?.length === 10 ? lastPageParam + 1 : undefined;
    },
  });

  const handleNextPage = async() =>{
    const result = await fetchNextPage();
    console.log(result.data?.pages);
    setPagination({pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize})
    table.nextPage();
    console.log('NEXTED')
  }

  const handlePreviousPage = async() =>{
    await fetchPreviousPage();
    setPagination({pageIndex:pagination.pageIndex - 1, pageSize: pagination.pageSize});
    table.previousPage();
    console.log('PREVV')

  }




  const [tableCount, setTableCount] = useState<number | null>(null);
  useEffect(() => {
    const getTableCount = async () => {
      const { count, error } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching count:", error);
        return null;
      }

      console.log("Total count:", count);
      setTableCount(count);
    };
    getTableCount();
  }, []);

  useEffect(() => {
    console.log('changed page')
    fetchSubscriptions();
  }, [pagination.pageIndex]);

  const columns = React.useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-black"
          />
        ),
        cell: ({ row }) => {
          const rowId = row.original.id;
          const isChecked = selectedSubscriptionIds.includes(rowId);

          return (
            <Checkbox
              checked={isChecked}
              onCheckedChange={(value) => {
                setSelectedSubscriptionIds(!!value, rowId); // Dispatch Redux action
              }}
              aria-label="Select row"
              className="border-black"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "full_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("full_name")}</div>
        ),
      },
      {
        accessorKey: "email1",
        header: "Email",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("email1")}</div>
        ),
      },
      {
        accessorKey: "person_country",
        header: "Country",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("person_country")}</div>
        ),
      },
      {
        accessorKey: "company_name",
        header: "Company",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("company_name")}</div>
        ),
      },
      {
        accessorKey: "person_industry",
        header: "Industry",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("person_industry")}</div>
        ),
      },
      {
        id: "actions",
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
                <DropdownMenuItem onClick={() => console.log(subscription.id)}>
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [selectedSubscriptionIds]
  ); // Memoized with dependencies

  const table = useReactTable({
    data : subsData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    // onPaginationChange: setPagination,
  });

  const getAllSelectedRows = () => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  };

  const setAllSelectedSubscriptionIds = (checkboxValue: boolean) => {
    const allSelectedRows = getAllSelectedRows();
    console.log("all selected rowsss", allSelectedRows);
  };
  
  
  const setSelectedSubscriptionIds = (
    checkboxValue: boolean,
    rowId: number
  ) => {
    console.log("CHECKBOX ROW ID ", rowId);

    if (checkboxValue) {
      dispatch(addSelectedSubscription(rowId)); // ✅ Using action creator
    } else {
      dispatch(removeSelectedSubscription(rowId)); // ✅ Now using correct action creator
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={() => {
          console.log(pagination.pageIndex);
        }}
      ></Button>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("full_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {tableCount}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {handlePreviousPage()}}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {handleNextPage()}}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
