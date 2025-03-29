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
import {  useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export function SubscriptionsTable() {


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10, 
  });

  const dispatch = useDispatch();
  const selectedSubscriptionIds = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedSubscriptionIds
  );

  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [appliedSearchBarValue, setAppliedSearchBarValue] = useState<string>("");
const queryClient = useQueryClient();

const fetchSubscriptions = async ({ pageParam = 1 }) => {
  const pageSize = 10; // Fixed page size


    const { data: sessionData, error } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/table?page=${pageParam}&pageSize=${pageSize}&search=${appliedSearchBarValue}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Attach token in request
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  console.log('table data:',result.data)
return result.data;

};

  const { data, fetchNextPage,fetchPreviousPage } = useInfiniteQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages,lastPageParam) => {
      return lastPage?.length === 10 ? lastPageParam + 1 : undefined;
    },
  });

  const handleNextPage = async() =>{
    const result = await fetchNextPage();
    console.log(result.data?.pages);
    setPagination({pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize})
    table.nextPage();
  }

  const handlePreviousPage = async() =>{
    await fetchPreviousPage();
    setPagination({pageIndex:pagination.pageIndex - 1, pageSize: pagination.pageSize});
    table.previousPage();

  }




  const [tableCount, setTableCount] = useState<number | null>(null);

  useEffect(() => {
    const getTableCount = async () => {
      const { count, error } = await supabase
        .from("subscribers")
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
            onCheckedChange={(value) =>{
              table.toggleAllPageRowsSelected(!!value)
              setAllSelectedSubscriptionIds(!!value);
              console.log(value);
            }
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
                setSelectedSubscriptionIds(!!value, rowId);
                console.log(rowId);
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
        accessorFn: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`, // ✅ Handles missing names safely
        id: "full_name", // We use `id` instead of `accessorKey` since it's computed
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
      },
      {
        accessorKey: "emails",
        header: "Email",
        cell: ({ row }) => {
            const emails =
              (row.getValue("emails") as { email: string }[]) || [];
              return(
      <div className="">
        {emails.length > 0 ? emails[0].email : "No Email"}
      </div>);
        },
      },
      {
        accessorKey: "addresses",
        header: "Country",
        cell: ({ row }) => 
        {
          // console.log(row.getValue());
          // console.log(row.getValue("addresses"));
          const address = row.getValue("addresses") as { country: string };
          
          return(
          <div className="capitalize">{address.country}</div>
  )},
      },
      {
        accessorKey: "companies",
        header: "Company",
        cell: ({ row }) => {
          const company = row.getValue("companies") as { name: string };
          return(
          <div className="capitalize">{company.name}</div>)
      },
      },
      {
        accessorKey: "active_status",
        header: "Active",
        cell: ({ row }) => (
          <div className="capitalize">
            {row.getValue("active_status") ? (
              <div className="bg-green-200 text-center rounded-full mx-5">
                Active
              </div>
            ) : (
              <div className="bg-red-200 text-center rounded-full mx-5">
                Inactive
              </div>
            )}
          </div>
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
                {/* <DropdownMenuItem onClick={() => console.log(subscription.id)}>
                  View
                </DropdownMenuItem> */}
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [selectedSubscriptionIds]
  );


  const subscriptions = React.useMemo(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data]
  );


  useEffect(() => {
    const currentPageSubscriptions = data?.pages[pagination.pageIndex] || [];
    const subIds = currentPageSubscriptions.map((sub : Subscription) => sub.id);
    setRowSelection(subIds); // Update the rowSelection state
  }, [subscriptions]);

  useEffect(() => {
    console.log("Updated rowSelection:", rowSelection);
  }, [rowSelection]);

  const table = useReactTable({
    data: subscriptions,
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
  });

  const getAllSelectedRows = () => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  };

  const setAllSelectedSubscriptionIds = (checkboxValue: boolean) => {
    console.log(' set all running')

    const allRows = table.getSelectedRowModel().rows;
    console.log(allRows)
    allRows.map(row =>{
      setSelectedSubscriptionIds(checkboxValue,row.original.id)
    })
  };
  
  
  const setSelectedSubscriptionIds = (
    checkboxValue: boolean,
    rowId: number
  ) => {
    console.log("CHECKBOX ROW ID ", rowId);

    if (checkboxValue) {
      dispatch(addSelectedSubscription(rowId));
    } else {
      dispatch(removeSelectedSubscription(rowId));
    }
  };

  const searchButtonClicked = async () =>{
          await queryClient.removeQueries({ queryKey: ["subscriptions"] });
          setPagination({ pageIndex: 0, pageSize: 10 });
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name..."
          value={searchBarValue}
          onChange={(event) => setSearchBarValue(event.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setAppliedSearchBarValue(searchBarValue);
            searchButtonClicked();
          }}
        >
          Search
        </Button>
        <Button onClick={()=>{console.log(selectedSubscriptionIds)}}></Button>
        {/* <Button onClick={async ()=>{signIn('user@example.com','12345'); const user = await supabase.auth.getUser();console.log(user)}}></Button> */}
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
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
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
              : [...Array(10)].map(
                  (
                    _,
                    index
                  ) => (
                    <TableRow key={index}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="h-8 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
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
            onClick={() => {
              handlePreviousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleNextPage();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
