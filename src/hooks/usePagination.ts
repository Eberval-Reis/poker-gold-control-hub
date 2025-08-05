import { useState, useMemo } from 'react';

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface UsePaginationReturn {
  pagination: PaginationConfig;
  paginatedData: any[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export const usePagination = <T>(
  data: T[],
  initialPageSize: number = 10
): UsePaginationReturn => {
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: initialPageSize,
    total: data.length,
  });

  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, pagination.page, pagination.pageSize]);

  const totalPages = Math.ceil(data.length / pagination.pageSize);
  const hasNextPage = pagination.page < totalPages;
  const hasPreviousPage = pagination.page > 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPagination(prev => ({
        ...prev,
        page,
        total: data.length,
      }));
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      goToPage(pagination.page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      goToPage(pagination.page - 1);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  return {
    pagination: { ...pagination, total: data.length },
    paginatedData,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
};