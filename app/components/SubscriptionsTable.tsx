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
  getExpandedRowModel,
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
import Link from "next/link";

import { Subscription } from "@/types/subscription";
import { supabase } from "@/lib/supabase";

import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  addSelectedEmails,
  removeSelectedEmails,
} from "@/store/slices/subscriptionSlice";
import {  useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {Email} from "@/types/email"

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
  const selectedEmails = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedEmails
  );

  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [appliedSearchBarValue, setAppliedSearchBarValue] = useState<string>("");
const queryClient = useQueryClient();
const fetchSubscriptions = async ({ pageParam = 1 }) => {
  const pageSize = 10; // Fixed page size


    const { data: sessionData, error } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

if(!token){
  return;
}


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

  const { data, fetchNextPage, fetchPreviousPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["subscriptions"],
      queryFn: fetchSubscriptions,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        return lastPage?.length === 10 ? lastPageParam + 1 : undefined;
      },
      refetchOnWindowFocus: false,
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
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                setAllSelectedSubscriptionIds(!!value);
                // console.log(value);
              }}
              aria-label="Select all"
              className="border-black"
            />
          );
        },
        cell: ({ row }) => {
          const rowId = row.original.id;
          const isChecked = row.original.emails.every((email: Email) =>
            selectedEmails.includes(email)
          );
          // console.log('IS CHECKED?', isChecked)
          // console.log('CHECKED????' ,row.getIsSelected())

          return (
            <Checkbox
              checked={isChecked}
              onCheckedChange={(value) => {
                console.log(row.original.emails);
              row.original.emails.forEach((email:  Email ) => {
                console.log(email.email, email.id)
                setSelectedEmails(!!value, email);
              });

                // setSelectedSubscriptionIds(!!value, rowId);
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
      // {
      //   id: "expander",
      //   header: () => null,
      //   cell: ({ row }: { row: any }) => (
      //     <button {...{ onClick: row.getToggleExpandedHandler() }}>
      //       {row.getIsExpanded() ? "▼" : "▶"}
      //     </button>
      //   ),
      // },
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
          const emails = (row.getValue("emails") as { email: string }[]) || [];
          return (
            <div className="">
              {emails.length > 1 && (
                <button
                  className="bg-slate-200 p-1 rounded-md border  shadow-lg transition-transform duration-300 hover:shadow-xl hover:bg-slate-500 h-1/2 w-auto"
                  {...{ onClick: row.getToggleExpandedHandler() }}
                >
                  {row.getIsExpanded() ? "🢄" : "🢂"}
                </button>
              )}
              {emails.length > 0 ? emails[0].email : "No Email"}
            </div>
          );
        },
      },
      {
        accessorKey: "addresses",
        header: "Country",
        cell: ({ row }) => {
          // console.log(row.getValue());
          // console.log(row.getValue("addresses"));
          const address = row.getValue("addresses") as { country: string };

          return <div className="capitalize">{address.country}</div>;
        },
      },
      {
        accessorKey: "companies",
        header: "Company",
        cell: ({ row }) => {
          const company = row.getValue("companies") as { name: string };
          return <div className="capitalize">{company.name}</div>;
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
              <div className="bg-slate-200 text-center rounded-full mx-5">
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
                <Link href={`/ViewPage/${subscription.id}`}>
                  <DropdownMenuItem
                    onClick={() => console.log(subscription.id)}
                  >
                    View
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [selectedEmails]
  );


  const subscriptions = React.useMemo(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data]
  );


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
    getExpandedRowModel: getExpandedRowModel(), // ✅ Enable expanded row model
    getRowCanExpand: () => true,
    enableRowSelection: true,
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
    const allRows = table.getRowModel().rows;
    allRows.map(row =>{
      row.original.emails.map((email: {email:string,id:number})=>{
        setSelectedEmails(checkboxValue, email);
      })
    })
  };
  
  
  const setSelectedEmails = (
    checkboxValue: boolean,
    emailObj: {email:string, id:number}
  ) => {
    if (checkboxValue) {
      dispatch(addSelectedEmails(emailObj));
    } else {
      dispatch(removeSelectedEmails(emailObj));
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
        <Button
          onClick={() => {
            console.log(selectedEmails);
          }}
        ></Button>
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
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
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

                  {row.getIsExpanded() &&
                    row.original.emails.map((email: Email, index: number) => {
                      const isChecked = selectedEmails.includes(email);
                      return (
                        <TableRow key={email.id}>
                          <TableCell>
                            <Checkbox
                              className="border-slate-500"
                              checked={isChecked}
                              onCheckedChange={(value) => {
                                setSelectedEmails(!!value, email);
                              }}
                            ></Checkbox>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>{email.email}</TableCell>
                        </TableRow>
                      );
                    })}
                </React.Fragment>
              ))
            ) : isLoading ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-8 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-120 text-center"
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
