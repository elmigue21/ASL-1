"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import {
  ColumnDef,
  // ColumnFiltersState,
  SortingState,
  // VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { /* ArrowUpDown  *//* , ChevronDown *//* , */ MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
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
// import {  useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Email } from "@/types/email";
// import { useCallback } from "react";
import { useQuery /* ,keepPreviousData */ } from "@tanstack/react-query";
// import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";

export function SubscriptionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  /*  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  ); */
  // const [columnVisibility, setColumnVisibility] =
  //   React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const dispatch = useDispatch();
  const selectedEmails = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedEmails
  );

  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [appliedSearchBarValue, setAppliedSearchBarValue] =
    useState<string>("");
  const queryClient = useQueryClient();
  const fetchSubscriptions = async ({
    queryKey,
  }: {
    queryKey: [string, { pageIndex: number; pageSize: number }];
  }) => {
    // const pageSize = 10; // Fixed page size
    const [, paginationVal] = queryKey;

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/table?page=${
        paginationVal.pageIndex + 1
      }&pageSize=${paginationVal.pageSize}&search=${appliedSearchBarValue}`,
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
    console.log("table data:", result.data);
    return result.data;
  };

  const { data, isLoading /* , isError  */ } = useQuery({
    queryKey: [
      "subscriptions",
      // page,
      // pagination.pageIndex,
      // pagination.pageSize,
      pagination,
    ],
    queryFn: fetchSubscriptions,
    placeholderData: true,
  });
  const subscriptions = data || [];

  // const {data,isLoading,isError} = useQuery({["subscriptions"]})

  const [tableCount, setTableCount] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1) {
      console.log("PAGE NUMBER", pageNum);
      // setPage(pageNum);
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageNum - 1,
      }));
    }
  };

  const nextPage = () => {
    if (pagination.pageIndex + 1 > pageCount) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  const prevPage = () => {
    if (pagination.pageIndex - 1 > pageCount) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex - 1,
    }));
  };

  useEffect(() => {
    const getTableCount = async () => {
      const { count, error } = await supabase
        .from("subscribers")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching count:", error);
        return null;
      }

      const totalCount = count ?? 0;
      console.log("Total count:", count);
      setTableCount(totalCount);
      setPageCount(Math.ceil(totalCount / pagination.pageSize));
    };
    getTableCount();
  }, [pagination.pageSize]);
  useEffect(() => {
    console.log("pagecoutn", pageCount);
  }, [pageCount]);

  const visiblePages = () => {
    const pages = [];
    const total = pageCount ? pageCount : 0;

    const currentPage = pagination.pageIndex + 1; // adjust because pageIndex is 0-based

    let start = Math.max(currentPage - 2, 1);
    const end = Math.min(start + 4, total);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  

  const columns = React.useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        header: "#",
        id: "rowNumber",
        cell: (info) => {
          const rowIndex = info.row.index;
          const computedValue =
            pagination.pageIndex * pagination.pageSize + rowIndex + 1;

          return computedValue;
        },
      },
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


          return (
            <Checkbox
              checked={isChecked}
              onCheckedChange={(value) => {
                console.log(row.original.emails);
                row.original.emails.forEach((email: Email) => {
                  console.log(email.email, email.id);
                  setSelectedEmails(!!value, email);
                });

                // setSelectedSubscriptionIds(!!value, rowId);
                console.log(rowId);
              }}
              aria-label="Select row"
              className="border-black hover:cursor-pointer hover:bg-slate-200 hover:border-slate-500 active:scale-80 transition-transform duration-300"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorFn: (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`, // ✅ Handles missing names safely
        id: "full_name", // We use `id` instead of `accessorKey` since it's computed
        header: ({ /* column */ }) => (
          <Button
            variant="ghost"
            // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name {/* <ArrowUpDown /> */}
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
                  className="p-1 rounded-full transition-all active:scale-80 hover:cursor-pointer duration-200 active:bg-white hover:shadow-xl hover:bg-slate-500 h-1/2 w-auto"
                  {...{ onClick: row.getToggleExpandedHandler() }}
                >
                  {row.getIsExpanded() ? <Image src="/angle-down.png" width={15} height={15} alt="arrowdown"/> : <Image src="/angle-right.png" width={15} height={15} alt="arrowright"/>}
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
          <div className="capitalize flex items-center justify-center">
            {row.getValue("active_status") ? (
              <span className="bg-green-200 text-center rounded-full p-1 w-1/2 inline-flex items-center justify-evenly">
                <div className="bg-green-900 w-2 h-2 rounded-full"></div>
                <p>Active</p>
              </span>
            ) : (
              <div className="bg-red-200 text-center rounded-full mx-5 flex items-center justify-evenly w-1/2 p-1">
                <div className="bg-red-900 w-2 h-2 rounded-full"></div>
                <p>Inactive</p>
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
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-slate-200 hover:cursor-pointer rounded-full active:bg-slate-800 active:scale-80 transition-all"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/ViewPage/${subscription.id}`}>
                  <DropdownMenuItem
                    onClick={() => console.log(subscription.id)}
                    className="hover:cursor-pointer"
                  >
                    View
                  </DropdownMenuItem>
                </Link>
                <Link href="/editPage">
                  <DropdownMenuItem
                  className="hover:cursor-pointer">Edit Details</DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="hover:cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [
      selectedEmails, pagination.pageIndex
    ]
  );

  const table = useReactTable({
    data: subscriptions,
    columns,
    onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(), // ✅ Enable expanded row model
    getRowCanExpand: () => true,
    enableRowSelection: true,
    manualPagination: true,
    // pageCount:pageCount,
    state: {
      sorting,
      // columnFilters,
      // columnVisibility,
      rowSelection,
      pagination,
    },
  });



  const setAllSelectedSubscriptionIds = (checkboxValue: boolean) => {
    const allRows = table.getRowModel().rows;
    allRows.map((row) => {
      row.original.emails.map((email: { email: string; id: number }) => {
        setSelectedEmails(checkboxValue, email);
      });
    });
  };

  const setSelectedEmails = React.useCallback(
    (checkboxValue: boolean, emailObj: { email: string; id: number }) => {
      if (checkboxValue) {
        dispatch(addSelectedEmails(emailObj));
      } else {
        dispatch(removeSelectedEmails(emailObj));
      }
    },
    [dispatch]
  );

  const searchButtonClicked = async () => {
    await queryClient.removeQueries({ queryKey: ["subscriptions"] });
    setPagination({ pageIndex: 1, pageSize: 10 });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name..."
          value={searchBarValue}
          onChange={(event) => setSearchBarValue(event.target.value)}
          className="max-w-sm"
        />
        {/*  <Button onClick={()=>{ goToPage(3)}}>JUMP</Button> */}
        <Button
          onClick={() => {
            setAppliedSearchBarValue(searchBarValue);
            searchButtonClicked();
          }}
        >
          Search
        </Button>

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
                          index === 1 ||
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
                    row.original.emails.map(
                      (email: Email /* , index: number */) => {
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
                      }
                    )}
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
          {table.getSelectedRowModel().rows.length} of {tableCount}
          row(s) selected.
        </div>
        <div className="flex flex-row space-x-2">
          <Button
            className="hover:cursor-pointer hover:bg-slate-200 active:scale-80 transition-transform duration-300"
            variant="outline"
            size="sm"
            onClick={() => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
              }));
            }}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            className="hover:cursor-pointer hover:bg-slate-200 active:scale-80 transition-transform duration-300"
            variant="outline"
            size="sm"
            onClick={() => {
              // handlePreviousPage();
              prevPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {visiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 border rounded hover:bg-blue-200 hover:cursor-pointer active:bg-blue-800 active:scale-90 transition-all duration-100  ${
                  page - 1 === pagination.pageIndex
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            className="hover:cursor-pointer hover:bg-slate-200 active:scale-80 transition-transform duration-300"
            variant="outline"
            size="sm"
            onClick={() => {
              // handleNextPage();
              nextPage();
            }}
            disabled={pagination.pageIndex + 1 >= pageCount}
          >
            Next
          </Button>
          <Button
            className="hover:cursor-pointer hover:bg-slate-200 active:scale-80 transition-transform duration-300"
            variant="outline"
            size="sm"
            onClick={() => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: pageCount - 1,
              }));
            }}
            disabled={pagination.pageIndex + 1 >= pageCount}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
