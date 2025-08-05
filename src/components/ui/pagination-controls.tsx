import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { UsePaginationReturn } from '@/hooks/usePagination';

interface PaginationControlsProps {
  pagination: UsePaginationReturn;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  className = '',
}) => {
  const {
    pagination: { page, pageSize, total },
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  } = pagination;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between space-x-2 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {total} registros
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Botões de navegação */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirstPage}
          disabled={!hasPreviousPage}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Páginas numeradas */}
        <div className="hidden sm:flex items-center space-x-1">
          {getVisiblePages().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-2 py-1 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum as number)}
                  className="min-w-[2rem]"
                >
                  {pageNum}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Select de página para mobile */}
        <div className="flex sm:hidden items-center space-x-2">
          <span className="text-sm">Página</span>
          <Select value={page.toString()} onValueChange={(value) => goToPage(parseInt(value))}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <SelectItem key={pageNum} value={pageNum.toString()}>
                  {pageNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">de {totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToLastPage}
          disabled={!hasNextPage}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};