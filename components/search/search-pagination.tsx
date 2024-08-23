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
  const getPageUrl = (page: number) =>
    page > 0 && page <= totalPages
      ? getUrlWithPageNumber(params, page)
      : undefined;

  const PaginationButton = ({ direction }: { direction: 'prev' | 'next' }) => {
    const isNext = direction === 'next';
    const targetPage = isNext ? pageNumber + 1 : pageNumber - 1;
    const url = getPageUrl(targetPage);
    const Icon = isNext ? ChevronRightIcon : ChevronLeftIcon;
    const label = `${isNext ? 'Next' : 'Previous'} Page`;

    return url ? (
      <Link
        className={buttonVariants({ variant: 'outline', size: 'icon' })}
        aria-label={label}
        href={url}
      >
        <Icon className="size-5" aria-hidden="true" />
      </Link>
    ) : (
      <Button
        variant="outline"
        aria-label={`No ${label}`}
        aria-disabled={true}
        disabled={true}
        size="icon"
      >
        <Icon className="size-5" aria-hidden="true" />
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-end gap-x-1">
      <PaginationButton direction="prev" />
      <PaginationButton direction="next" />
    </div>
  );
}
