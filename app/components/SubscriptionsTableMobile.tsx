'use client'
import React from 'react'
import {useState, useEffect} from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Subscription } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SubscriptionsTableMobile = () => {

      const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
      });

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
     const subscriptions = Array.isArray(data) ? data : [];

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
//   useEffect(() => {
//     console.log("pagecoutn", pageCount);
//   }, [pageCount]);
     // const {data,isLoading,isError} = useQuery({["subscriptions"]})

     const [tableCount, setTableCount] = useState<number | null>(null);
     const [pageCount, setPageCount] = useState<number>(0);

  return (
    <div className="w-full h-full">
      <h1 className="font-bold text-2xl">Subscription Table</h1>
      <div className="min-h-3/4">
        {subscriptions.map((sub: Subscription) => (
          <div
            key={sub.id}
            className="mb-4 w-full flex items-center justify-evenly p-10 border border-black rounded-md shadow-md"
          >
            <h2 className="text-lg font-semibold flex items-center text-left w-3/4">
              <div
                className={`w-4 h-4 rounded-full ${
                  sub.active_status ? "bg-green-500 border border-green-200" : "bg-red-500 border border-red-200"
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
      <div className="flex items-center justify-center gap-10">
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
    </div>
  );
}

export default SubscriptionsTableMobile