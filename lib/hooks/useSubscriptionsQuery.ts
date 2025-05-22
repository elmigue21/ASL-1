import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface UseSubscriptionsQueryParams {
  appliedSearchBarValue: string;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

export function useSubscriptionsQuery({
  appliedSearchBarValue,
  pagination,
  setPagination,
}: UseSubscriptionsQueryParams) {
  const queryClient = useQueryClient();

      const [archiveFilter, setArchiveFilter] = useState<boolean>(false);
    const [verifiedFilter, setVerifiedFilter] = useState<boolean>(true);

  const fetchSubscriptions = async () => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/table`);
    url.searchParams.append("page", String(pagination.pageIndex + 1));
    url.searchParams.append("pageSize", String(pagination.pageSize));
    url.searchParams.append("search", appliedSearchBarValue);
    url.searchParams.append("archive", archiveFilter ? "true" : "false");
    url.searchParams.append("verified", verifiedFilter ? "true" : "false");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    return result.data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["subscriptions", pagination, appliedSearchBarValue, archiveFilter, verifiedFilter],
    queryFn: fetchSubscriptions,
    placeholderData: true,
    // keepPreviousData: true,
  });

  // Pagination handlers (now affecting the passed-in state)
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageNum - 1,
      }));
    }
  };

  const nextPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  const prevPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(prev.pageIndex - 1, 0),
    }));
  };

  const setPageSize = (newPageSize: number) => {
    setPagination(() => ({
      pageIndex: 0,
      pageSize: newPageSize,
    }));
  };

  const searchButtonClicked = async () => {
    await queryClient.removeQueries({ queryKey: ["subscriptions"] });
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const archiveRow = async (id : number | string) => {
     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/table/archive?id=${id}`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
         credentials: "include",
       }
     );

     if (!response.ok) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }

     const result = await response.json();
     return result.data;
  }

  return {
    subscriptions: Array.isArray(data) ? data : [],
    isLoading,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    searchButtonClicked,
    isFetching,
    archiveRow,
      archiveFilter,
    setArchiveFilter,
    verifiedFilter,
    setVerifiedFilter,
  };
}
