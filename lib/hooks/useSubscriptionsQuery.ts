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

  const fetchSubscriptions = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/table?page=${
        pagination.pageIndex + 1
      }&pageSize=${pagination.pageSize}&search=${appliedSearchBarValue}`,
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
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["subscriptions", pagination, appliedSearchBarValue],
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
  };
}
