import Link from 'next/link';
import type { ApiSearchParams } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button, buttonVariants } from '../ui/button';
import { getUrlWithPageNumber } from './search-params';

interface SearchPaginationProps {
  params: ApiSearchParams;
  totalPages: number;
}

export function SearchPagination({
  params,
  totalPages,
}: SearchPaginationProps) {
  const pageNumber = params.pageNumber || 1;
  const prevUrl =
    pageNumber > 1 && totalPages
      ? getUrlWithPageNumber(params, pageNumber - 1)
      : undefined;
  const nextUrl =
    pageNumber < totalPages
      ? getUrlWithPageNumber(params, pageNumber + 1)
      : undefined;

  return (
    <div className="flex items-center justify-end gap-x-2">
      {prevUrl ? (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          aria-label="Previous Page"
          aria-disabled={pageNumber <= 1 || !totalPages}
          href={prevUrl}
        >
          <ChevronLeftIcon className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <Button
          variant="outline"
          aria-label="No Previous Page"
          aria-disabled={true}
          disabled={true}
        >
          <ChevronLeftIcon className="size-5" aria-hidden="true" />
        </Button>
      )}
      {nextUrl ? (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          aria-label="Next Page"
          aria-disabled={pageNumber >= totalPages}
          href={nextUrl}
        >
          <ChevronRightIcon className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <Button
          variant="outline"
          aria-label="No Next Page"
          aria-disabled={true}
          disabled={true}
        >
          <ChevronRightIcon className="size-5" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
