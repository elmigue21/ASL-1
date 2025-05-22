"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  addSelectedEmails,
  removeSelectedEmails,
} from "@/store/slices/subscriptionSlice";

// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";

import useMediaQuery from "@/lib/hooks/useMediaQuery";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { Subscription } from "@/types/subscription";
import { Email } from "@/types/email";

import EmailWindow from "./EmailWindow";

import { useSubscriptionsQuery } from "@/lib/hooks/useSubscriptionsQuery";
import { Loader } from "lucide-react";


type Pagination = {
  pageIndex: number;
  pageSize: number;
};

type SubscriptionsTableProps = {
  subscriptions: Subscription[];
  isLoading: boolean;
  pagination: Pagination;
  goToPage: (pageNum: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setAppliedSearchBarValue: (value: string) => void;
  appliedSearchBarValue: string;
  searchButtonClicked: () => void;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  isFetching: boolean;
};

const SubTable = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTallViewport = useMediaQuery("(min-height: 800px)");


    const initialPageSize = isMobile ? 5 : isTallViewport ? 10 : 5;

    // Pagination state with dynamic pageSize
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: initialPageSize,
    });

    const [appliedSearchBarValue, setAppliedSearchBarValue]= useState("")

      React.useEffect(() => {
        setPagination((prev) => ({
          ...prev,
          pageIndex: 0, // reset to first page on device change (optional)
          pageSize: initialPageSize,
        }));
      }, [initialPageSize]);

      const { subscriptions, isLoading, goToPage, nextPage, prevPage, searchButtonClicked ,isFetching} =
        useSubscriptionsQuery({
          pagination,
          setPagination,
          appliedSearchBarValue,
        //   searchButtonClicked,
        });

    return isMobile ? (
      <SubscriptionsTableMobile
        subscriptions={subscriptions}
        isLoading={isLoading}
        pagination={pagination}
        goToPage={goToPage}
        nextPage={nextPage}
        prevPage={prevPage}
        setAppliedSearchBarValue={setAppliedSearchBarValue}
        appliedSearchBarValue={appliedSearchBarValue}
        searchButtonClicked={searchButtonClicked}
        setPagination={setPagination}
        isFetching={isFetching}
      />
    ) : (
      <SubscriptionsTableDesktop
        subscriptions={subscriptions}
        isLoading={isLoading}
        pagination={pagination}
        goToPage={goToPage}
        nextPage={nextPage}
        prevPage={prevPage}
        setAppliedSearchBarValue={setAppliedSearchBarValue}
        appliedSearchBarValue={appliedSearchBarValue}
        searchButtonClicked={searchButtonClicked}
        setPagination={setPagination}
        isFetching={isFetching}
      />
    );
};
export default SubTable;

const SubscriptionsTableMobile = ({
  subscriptions,
  isLoading,
  pagination,
  goToPage,
  nextPage,
  prevPage,
  appliedSearchBarValue,
  setAppliedSearchBarValue,
  searchButtonClicked,
  setPagination,
  isFetching,
}: SubscriptionsTableProps) => {


  const [tableCount, setTableCount] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  return (
    <>
      <div className="w-full h-full flex flex-col pb-[500px] ">
        <h1 className="font-bold text-2xl">Subscription Table</h1>
        <div className="flex">
          <Input
            placeholder="Search by name..."
            onChange={(e) => setAppliedSearchBarValue(e.target.value)}
            value={appliedSearchBarValue}
          />
          {/* <Button onClick={()=>{searchButtonClicked()}}>Search</Button> */}
        </div>
        <div className="min-h-3/4 flex-1 pb-[500]">
          {subscriptions.map((sub: Subscription) => (
            <div
              key={sub.id}
              className="mb-4 w-full flex items-center justify-evenly p-10 border border-black rounded-md shadow-md"
            >
              <h2 className="text-lg font-semibold flex items-center text-left w-3/4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    sub.active_status
                      ? "bg-green-500 border border-green-200"
                      : "bg-red-500 border border-red-200"
                  }`}
                />
                {sub.first_name} {sub.last_name}
              </h2>
              <Link href={`/ViewPage/${sub.id}`}>
                <Button>View</Button>
              </Link>
              {/* <p className="text-sm text-gray-600">{sub.email}</p> */}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-10 bottom-0 bg-blue-800 w-screen left-0 fixed p-5">
        <Button
          onClick={() => {
            prevPage();
          }}
        >
          Prev
        </Button>
        <Button
          onClick={() => {
            nextPage();
          }}
          className="active:scale-80 active:bg-slate-400"
        >
          Next
        </Button>
      </div>
    </>
  );
};

function SubscriptionsTableDesktop({
  subscriptions,
  isLoading,
  pagination,
  goToPage,
  nextPage,
  prevPage,
  appliedSearchBarValue,
  setAppliedSearchBarValue,
  searchButtonClicked,
  setPagination,
  isFetching,
}: SubscriptionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = React.useState({});

  const dispatch = useDispatch();
  const selectedEmails = useSelector(
    (state: RootState) => state.SubscriptionSlice.selectedEmails
  );

  const [tableCount, setTableCount] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  useEffect(() => {
    const getTableCount = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/table/tableCount?search=${appliedSearchBarValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      const totalCount = data.count ?? 0;
      console.log("Total count:", data.count);
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
          const isChecked =
            row.original.emails.every((email: Email) =>
              selectedEmails.includes(email)
            ) && row.original.emails.length !== 0;

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
        header: (
          {
            /* column */
          }
        ) => (
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
                  {row.getIsExpanded() ? (
                    <Image
                      src="/angle-down.png"
                      width={15}
                      height={15}
                      alt="arrowdown"
                    />
                  ) : (
                    <Image
                      src="/angle-right.png"
                      width={15}
                      height={15}
                      alt="arrowright"
                    />
                  )}
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

          return <div className="capitalize">{address?.country ?? ""}</div>;
        },
      },
      {
        accessorKey: "companies",
        header: "Company",
        cell: ({ row }) => {
          const company = row.getValue("companies") as { name: string };
          return <div className="capitalize">{company?.name ?? ""}</div>;
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
              <DropdownMenuTrigger
                asChild
                onClick={(e) => e.stopPropagation()} // prevent row click toggling
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-slate-200 hover:cursor-pointer rounded-full active:bg-slate-800 active:scale-80 transition-all"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="min-w-[120px] max-w-xs p-0" // limit width here
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/ViewPage/${subscription.id}`}>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(subscription.id);
                    }}
                    className="hover:cursor-pointer"
                  >
                    View
                  </DropdownMenuItem>
                </Link>

                <Link href="/editPage">
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    className="hover:cursor-pointer"
                  >
                    Edit Details
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // your delete logic here
                  }}
                  className="hover:cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [selectedEmails, pagination.pageIndex]
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

  //   const searchButtonClicked = async () => {
  //     await queryClient.removeQueries({ queryKey: ["subscriptions"] });
  //     setPagination({ pageIndex: 1, pageSize: 10 });
  //   };

  const [searchBarValue, setSearchBarValue] = useState("");

  if (isLoading) return <Loader/>; // or a spinner/loading component

  return (
    <div className="w-full z-50">
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
            {isFetching ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-8 w-full rounded-md bg-gray-300 dark:bg-gray-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
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
                      row.original.emails.map((email: Email) => {
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
                              />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>{email.email}</TableCell>
                          </TableRow>
                        );
                      })}
                  </React.Fragment>
                ))}

                {/* Fill empty rows if less than 10 */}
                {Array.from({
                  length: pagination.pageSize - table.getRowModel().rows.length,
                }).map((_, i) => (
                  <TableRow key={`empty-${i}`}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex} className="h-12" />
                    ))}
                  </TableRow>
                ))}
              </>
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
        <div className="flex flex-row space-x-2 sticky">
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
              // goToPage()
            }}
            disabled={pagination.pageIndex + 1 >= pageCount}
          >
            Last
          </Button>
        </div>
      </div>
      {/* <EmailWindow /> */}
    </div>
  );
}
