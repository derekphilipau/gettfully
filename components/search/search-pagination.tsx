'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '../ui/button';

interface SearchPaginationProps {
  pageNumber: number;
  totalPages: number;
  onPageNumberChange: (pageNumber: number) => void;
}

export function SearchPagination({
  pageNumber,
  totalPages,
  onPageNumberChange,
}: SearchPaginationProps) {
  return (
    <div className="flex items-center justify-end gap-x-2">
      <Button
        disabled={pageNumber <= 1 || !totalPages}
        onClick={() => onPageNumberChange(pageNumber - 1)}
        variant="outline"
        aria-label="Previous Page"
      >
        <ChevronLeftIcon className="size-5" aria-hidden="true" />
      </Button>
      <Button
        disabled={pageNumber >= totalPages}
        onClick={() => onPageNumberChange(pageNumber + 1)}
        variant="outline"
        aria-label="Next Page"
      >
        <ChevronRightIcon className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
